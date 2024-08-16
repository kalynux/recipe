import { useEffect, useState } from 'react';
import nn from './details.module.css';
import { FaClockRotateLeft, FaFire, FaHeart } from 'react-icons/fa6';
import { empty_recipe } from '../../assets';
import { useLocation, useParams } from 'react-router-dom';
import { get_reci_user, getUserInfo, supa } from '../../db/supa';
import { useDesktopContext } from '../../screen/desktop/desktop.context';
import EmptyStateComponent from '../../components/emptyState/emptyState.component';

const DetailsPage = () => {
    const context = useDesktopContext();
    const location = useLocation();
    const recipe = location.state?.data;
    const { id } = useParams();
    const [data, setData] = useState(recipe || null);
    const [loader, setLoader] = useState('loading...');

    useEffect(() => {
        const getRecipe = async () => {
            const recipe = await supa.from('recipes').select().eq('id', id);
            if (recipe.error) {
                context.updateProps({ noti: { text: recipe.error.message } });
                return null;
            }
            // const imagePaths =  "";
            for (let index = 0; index < recipe.data.length; index++) {
                const imagePaths = recipe.data[index].images;
                const getImages = await supa.storage
                    .from('recipe')
                    .createSignedUrls(imagePaths, 432000);
                const url = getImages.data.map((item) => item.signedUrl);
                recipe.data[index].images = url;
            }

            setData(recipe.data[0]);
            setLoader(recipe.data.length ? null : 'No Information found');
            return;
        };
        if (!data) {
            getRecipe();
        } else {
            setLoader(false);
        }
    }, []);

    useEffect(() => {
        context.updateProps({ noti: { text: loader } });
    }, [loader]);

    return (
        <div className={nn.container}>
            {data ? (
                <>
                    <div className={nn.top_box}>
                        {<h1 className={nn.recipe_name}>{data.name}</h1>}
                        {data && (
                            <InfoBox
                                calories={data.calories}
                                cookTime={data.cookTime}
                                origin={data.origin}
                                level={data.level}
                                idx={data.id}
                            />
                        )}
                    </div>
                    <div className={nn.grid_box}>
                        <div className={nn.left}>
                            {data?.ingredients && (
                                <div className={nn.box}>
                                    <h4>Ingredients</h4>
                                    <IngredientBox ingredients={data.ingredients} />
                                </div>
                            )}
                            {data?.instructions && (
                                <div className={nn.box}>
                                    <h4>Instructions</h4>
                                    <InstructionBox instructions={data.instructions} />
                                </div>
                            )}
                        </div>
                        <div className={nn.right}>
                            {data &&
                                data.images.map((item, i) => {
                                    return (
                                        <img
                                            key={i}
                                            className={nn.image_recipe}
                                            src={item || empty_recipe}
                                            loading="lazy"
                                            alt="image_tag"
                                        />
                                    );
                                })}
                        </div>
                    </div>
                </>
            ) : (
                <EmptyStateComponent text={loader || 'No Information found'} />
            )}
        </div>
    );
};

const InfoBox = ({ cookTime, calories, origin, level, likes, idx }) => {
    const context = useDesktopContext();
    const [liked, setLiked] = useState('');
    const [hasLoaded, setHasLoaded] = useState(false);

    const handleLiked = async ({}) => {
        const userId = getUserInfo()?.id;
        if (!userId) return navigate('/login');
        if (hasLoaded) {
            if (liked === 'var(--nn-grey)') {
                setLiked('var(--danger)');
                const likedRecipes = await get_reci_user();
                const { error } = await supa
                    .from('reci_user')
                    .update({ recipe: [...likedRecipes.recipe, idx.toString()] })
                    .eq('user_id', userId);
                if (error) {
                    setLiked('var(--nn-grey)');
                    context.updateProps({ noti: { text: error.message } });
                }
            } else {
                setLiked('var(--nn-grey)');
                const likedRecipes = await get_reci_user();
                const newlikedRecipes = likedRecipes.recipe.filter((r) => r !== idx.toString());
                const { error } = await supa
                    .from('reci_user')
                    .update({ recipe: [...newlikedRecipes] })
                    .eq('user_id', userId);
                if (error) {
                    setLiked('var(--danger)');
                    context.updateProps({ noti: { text: error.message } });
                }
            }
        }
    };

    useEffect(() => {
        const checkData = async () => {
            const likedRecipes = await get_reci_user();
            if (likedRecipes.recipe && likedRecipes.recipe.includes(idx.toString())) {
                setLiked('var(--danger)');
            } else {
                setLiked('var(--nn-grey)');
            }
            setHasLoaded(true);
        };

        checkData();
    }, []);

    return (
        <div className={nn.info_container}>
            {level && (
                <div className={nn.level}>
                    Level: <b>{level}</b>
                </div>
            )}
            {cookTime && (
                <div className={nn.time}>
                    {' '}
                    <FaClockRotateLeft /> {cookTime} min
                </div>
            )}
            {calories && (
                <div className={nn.time}>
                    {' '}
                    <FaFire /> {calories} Kcal
                </div>
            )}
            {origin && (
                <div className={nn.time}>
                    {' '}
                    Origin: <b>{origin}</b>
                </div>
            )}
            <div onClick={handleLiked} style={{ cursor: 'pointer' }} className={nn.time}>
                {' '}
                <FaHeart color={liked} /> {likes}
            </div>
        </div>
    );
};

const IngredientBox = ({ ingredients }) => {
    return (
        <div className={nn.box}>
            {ingredients.map((item, i) => {
                return (
                    <>
                        {i !== 0 && <hr />}
                        <div key={i} className={nn.ingred_item}>
                            <span>{item.label}</span>
                            <p>{item.quantity}</p>
                        </div>
                    </>
                );
            })}
        </div>
    );
};

const InstructionBox = ({ instructions }) => {
    return (
        <div className={nn.box}>
            <ol>
                {instructions.map((item, i) => {
                    return (
                        // <>
                        //     {i !== 0 && <hr />}
                        //     <div key={i} className={nn.ingred_item}>
                        //         <span>Ingredient {item}</span>
                        //         <p>100g</p>
                        //     </div>
                        // </>
                        <>
                            {i !== 0 && <hr />}
                            <li className={nn.instruct_item}>{item}</li>
                        </>
                    );
                })}
            </ol>
        </div>
    );
};

export default DetailsPage;
