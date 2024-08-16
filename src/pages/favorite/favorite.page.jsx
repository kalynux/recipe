import { useEffect, useState } from 'react';
import nn from './favorite.module.css';
import CardComponent from '../../components/card/card.component';
import { get_reci_user, supa } from '../../db/supa';
import { useDesktopContext } from '../../screen/desktop/desktop.context';
import EmptyStateComponent from '../../components/emptyState/emptyState.component';
import { useNavigate } from 'react-router-dom';
import { empty_recipe } from '../../assets';

const FavoritePage = () => {
    const navigate = useNavigate();
    const context = useDesktopContext();
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState('loading...');

    useEffect(() => {
        const getRecipes = async () => {
            const likedRecipes = await get_reci_user();
            const recipes = await supa.from('recipes').select().in('id', likedRecipes.recipe);
            if (recipes.error) {
                context.updateProps({ noti: { text: recipes.error.message } });
                return null;
            }
            // const imagePaths =  "";
            for (let index = 0; index < recipes.data.length; index++) {
                const imagePaths = recipes.data[index].images;
                const getImages = await supa.storage
                    .from('recipe')
                    .createSignedUrls(imagePaths, 432000);
                const url = getImages.data.map((item) => item.signedUrl);
                recipes.data[index].images = url;
            }

            setData(recipes.data);
            setLoader(recipes.data.length ? null : 'No Item Found');
            return;
        };
        getRecipes();
    }, []);

    const handleCardClicked = (item) => {
        const url = `/details/${item.id || ''}`;
        navigate(url, { state: { data: item } });
    };

    return (
        <div className={nn.container}>
            <div className={nn.card_container}>
                {data && data.length ? (
                    data.map((item, i) => {
                        return (
                            <CardComponent
                                key={i}
                                idx={item.id}
                                title={item.name}
                                energy={item.calories}
                                time={item.cookTime}
                                image={item?.images[0] || empty_recipe}
                                onClick={() => handleCardClicked(item)}
                            />
                        );
                    })
                ) : (
                    <EmptyStateComponent text={loader} />
                )}
            </div>
        </div>
    );
};

export default FavoritePage;
