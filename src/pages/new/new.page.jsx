import { useState } from 'react';
import nn from './new.module.css';
import { FaPencil, FaTrashCan } from 'react-icons/fa6';
import InputComponent from '../../components/input/input.component';
import { getUserInfo, supa } from '../../db/supa';
import { useDesktopContext } from '../../screen/desktop/desktop.context';

const AddNewPage = () => {
    const context = useDesktopContext();
    const userId = getUserInfo()?.id;
    const [recipeInfo, setRecipeInfo] = useState({
        name: '',
        level: '',
        cookTime: '',
        calories: '',
        origin: '',
        ingredients: [],
        instructions: [],
        images: [],
    });
    const [recipeImages, setRecipeImages] = useState([]);
    const [loader, setLoader] = useState(null);

    const [temp, setTemp] = useState({
        images: [],
        ingredients: { label: '', quantity: '' },
        instructions: '',
    });

    const [editIndex, setEditIndex] = useState({
        ingredients: null,
        instructions: null,
        images: null,
    });

    const handleChange = (ev) => {
        const { name, value } = ev.target;
        setRecipeInfo({ ...recipeInfo, [name]: value });
    };

    const handleAddItem = (obj) => {
        let initObj = '';
        if (typeof editIndex[obj] === 'number') {
            setRecipeInfo((prev) => {
                const newArray = [...prev[obj]];
                newArray[editIndex[obj]] = temp[obj];
                return { ...prev, [obj]: newArray };
            });
        } else {
            setRecipeInfo((prev) => ({ ...prev, [obj]: [...prev[obj], temp[obj]] }));
        }

        if (obj === 'ingredients') {
            initObj = { label: '', quantity: '' };
        }

        setTemp((prev) => ({ ...prev, [obj]: initObj }));
        setEditIndex((prev) => ({ ...prev, [obj]: null }));
    };

    const handleDelete = (target, idx) => {
        setRecipeInfo((prev) => ({
            ...prev,
            [target]: prev[target].filter((item, i) => i !== idx),
        }));
    };

    const handleDeleteImage = (idx) => {
        const newImages = [...recipeImages];
        newImages.splice(idx, 1);
        setRecipeImages(newImages);
    };

    const handleAddImage = (e) => {
        const newImages = Array.from(e.target.files);
        if (recipeImages.length + newImages.length > 5) return;
        setRecipeImages((prev) => [...prev, ...newImages]);
    };

    const handleItemChange = (ev) => {
        const { name, value } = ev.target;
        if (name === 'label' || name === 'quantity') {
            setTemp((prev) => ({ ...prev, ingredients: { ...prev.ingredients, [name]: value } }));
        } else {
            setTemp((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleEditing = (item, target, idx) => {
        setTemp((prev) => ({ ...prev, [target]: item }));
        setEditIndex((prev) => ({ ...prev, [target]: idx }));
    };

    const handleFormSubmit = async (ev) => {
        ev.preventDefault();
        setLoader('loading...');
        const isFormValid = validation();
        if (!isFormValid) return setLoader(null);

        const recipe = await supa
            .from('recipes')
            .insert([{ ...recipeInfo, publisher: userId }])
            .select();

        if (recipe.error) {
            context.updateProps({ noti: { text: recipe.error, color: 'pink' } });
            return;
        }

        if (recipe.data[0]) {
            const imagePaths = [];
            setLoader('Uploading files...');
            for (let index = 0; index < recipeImages.length; index++) {
                const image = recipeImages[index];
                const name = `${image.name}_${new Date().toISOString()}`;
                const uploadedImage = await supa.storage
                    .from('recipe')
                    .upload(`public/${name}`, image, {
                        cacheControl: '3600',
                        upsert: false,
                    });
                if (uploadedImage.error) {
                    context.updateProps({ noti: { text: uploadedImage.error, color: 'pink' } });
                }
                const path = uploadedImage.data.path;
                imagePaths.push(path.toString());
            }

            const savedPath = await supa
                .from('recipes')
                .update({ images: imagePaths })
                .eq('id', recipe.data[0].id);

            if (savedPath.error) {
                context.updateProps({ noti: { text: savedPath.error, color: 'pink' } });
                return;
            }

            setLoader(null);

            context.updateProps({
                noti: { text: 'Recipe added successfully', color: 'lightblue' },
            });

            setRecipeInfo({
                name: '',
                level: '',
                cookTime: '',
                calories: '',
                origin: '',
                ingredients: [],
                instructions: [],
                images: [],
            });
            setRecipeImages([]);

            setTimeout(() => {
                context.updateProps({ noti: { text: null } });
            }, 5000);
        }
    };

    const validation = () => {
        const { name, calories, ingredients, instructions, cookTime } = recipeInfo;
        if (name.trim() === '') return returnThis('Please enter a name for the recipe');
        if (!calories && !isNaN(calories)) return returnThis('Please enter a valid calory level');
        if (!cookTime && !isNaN(cookTime)) return returnThis('Please enter a cooking time period');
        if (ingredients.length <= 0) return returnThis('Please add ingredients to the recipe');
        if (instructions.length <= 0) return returnThis('Please add instructions to the recipe');
        if (recipeImages.length <= 0) return returnThis('Please add atleast an images of the recipe');

        function returnThis(text) {
            context.updateProps({ noti: { text } });
            setTimeout(() => {
                context.updateProps({ noti: { text: null } });
            }, 5000);
            return false;
        }

        return true;
    };

    return (
        <form onSubmit={handleFormSubmit} className={nn.form}>
            <div className={nn.container}>
                <div className={nn.input_container}>
                    <label htmlFor="name">Name of recipe *</label>
                    <InputComponent
                        id={'name'}
                        name={'name'}
                        value={recipeInfo.name || ''}
                        onChange={handleChange}
                        placeholder={'Riz Sauter'}
                    />
                </div>
                {/* <div className={nn.input_container}>
                    <label htmlFor="name">Category *</label>
                    <InputComponent
                        id={'name'}
                        name={'name'}
                        value={recipeInfo.name || ''}
                        onChange={handleChange}
                        placeholder={'Lunch, Dinner'}
                    />
                </div> */}
                <div className={nn.input_container}>
                    <label htmlFor="level">Level of difficulty</label>
                    <InputComponent
                        id={'level'}
                        name={'level'}
                        value={recipeInfo.level || ''}
                        onChange={handleChange}
                        placeholder={'easy, medium, difficult'}
                    />
                </div>
                <div className={nn.input_container}>
                    <label htmlFor="calories">Calories *</label>
                    <InputComponent
                        id={'calories'}
                        name={'calories'}
                        value={recipeInfo.calories || ''}
                        onChange={handleChange}
                        type="number"
                        placeholder={'in Kcal'}
                    />
                </div>
                <div className={nn.input_container}>
                    <label htmlFor="cookTime">Cooking time *</label>
                    <InputComponent
                        id={'cookTime'}
                        name={'cookTime'}
                        value={recipeInfo.cookTime || ''}
                        onChange={handleChange}
                        type="number"
                        placeholder={'in minutes'}
                    />
                </div>
                <div className={nn.input_container}>
                    <label htmlFor="origin">Cultural region</label>
                    <InputComponent
                        id={'origin'}
                        name={'origin'}
                        value={recipeInfo.origin || ''}
                        onChange={handleChange}
                        placeholder={'country, region'}
                    />
                </div>
                <div className={nn.input_container}>
                    <label htmlFor="ingredient">Ingredient *</label>
                    <div className={nn.display_container}>
                        {recipeInfo.ingredients.map((ingredient, i) => {
                            return (
                                <div key={i} className={nn.ingred_row_container}>
                                    <div className={nn.ingred_row_item}>
                                        <span>{ingredient.label}</span>
                                        <span>{ingredient.quantity}</span>
                                    </div>
                                    <div className={nn.ingred_row_icon}>
                                        <FaPencil
                                            onClick={() =>
                                                handleEditing(ingredient, 'ingredients', i)
                                            }
                                            className={nn.icon}
                                        />
                                        <FaTrashCan
                                            onClick={() => handleDelete('ingredients', i)}
                                            color="red"
                                            className={nn.icon}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className={nn.list_input}>
                        <InputComponent
                            id={'label'}
                            name={'label'}
                            value={temp.ingredients.label || ''}
                            onChange={handleItemChange}
                            placeholder={'ingredient name'}
                            componentStyle={{ width: '100%', margin: '0' }}
                        />
                        <InputComponent
                            id={'quantity'}
                            name={'quantity'}
                            value={temp.ingredients.quantity || ''}
                            onChange={handleItemChange}
                            placeholder={'quantity'}
                            componentStyle={{ width: '40%', margin: '0' }}
                        />
                        <button
                            type="button"
                            disabled={!temp.ingredients.label}
                            onClick={() => handleAddItem('ingredients')}
                            className={nn.add_item}
                        >
                            {editIndex.ingredients ? 'save' : '+ add'}
                        </button>
                    </div>
                </div>
                <div className={nn.input_container}>
                    <label htmlFor="instruction">Instruction *</label>
                    <div className={nn.display_container}>
                        {recipeInfo.instructions.map((intruction, i) => {
                            return (
                                <div key={i} className={nn.ingred_row_container}>
                                    <div className={nn.numbering}>{i + 1}.</div>
                                    <div className={nn.ingred_row_item}>
                                        <span>{intruction}</span>
                                    </div>
                                    <div className={nn.ingred_row_icon}>
                                        <FaPencil
                                            onClick={() =>
                                                handleEditing(intruction, 'instructions', i)
                                            }
                                            className={nn.icon}
                                        />
                                        <FaTrashCan
                                            onClick={() => handleDelete('instructions', i)}
                                            color="red"
                                            className={nn.icon}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className={nn.list_input}>
                        <textarea
                            id="instructions"
                            name="instructions"
                            value={temp.instructions || ''}
                            onChange={handleItemChange}
                            placeholder="add an instruction..."
                            className={nn.textarea}
                        />
                        <button
                            type="button"
                            disabled={!temp.instructions}
                            onClick={() => handleAddItem('instructions')}
                            className={nn.add_item}
                        >
                            {editIndex.instructions ? 'save' : '+ add'}
                        </button>
                    </div>
                </div>
                <div className={nn.input_container}>
                    <label htmlFor="images">Images *</label>
                    <div className={nn.display_container}>
                        {recipeImages.map((image, i) => {
                            return (
                                <div key={i} className={nn.ingred_row_container}>
                                    <div className={nn.ingred_row_item}>
                                        <img
                                            className={nn.recipe_img}
                                            src={URL.createObjectURL(image)}
                                            alt=""
                                        />
                                    </div>
                                    <div className={nn.ingred_row_icon}>
                                        <FaTrashCan
                                            onClick={() => handleDeleteImage(i)}
                                            color="red"
                                            className={nn.icon}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className={nn.list_input}>
                        <InputComponent
                            type={'file'}
                            id={'images'}
                            name={'images'}
                            value={temp.ingredients.images || ''}
                            onChange={handleAddImage}
                            placeholder={'Select an image'}
                            componentStyle={{ width: '100%', margin: '0', cursor: 'pointer' }}
                            multiple
                            fileType="image/*"
                        />
                    </div>
                </div>
                <button type="submit" className={loader ? nn.loading_btn : nn.btn}>
                    {loader ? loader : 'Save Recipe'}
                </button>
            </div>
        </form>
    );
};

export default AddNewPage;
