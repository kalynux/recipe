import React, { useEffect, useState } from 'react';
import nn from './recipe.module.css';
import CardComponent from '../../components/card/card.component';
import { FaChevronRight } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useDesktopContext } from '../../screen/desktop/desktop.context';
import { supa } from '../../db/supa';
import { person } from '../../assets';
import EmptyStateComponent from '../../components/emptyState/emptyState.component';

const RecipePage = () => {
    const context = useDesktopContext();
    const navigate = useNavigate();
    const [activeCat, setActiveCat] = useState(0);
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState('loading...');
    const options = ['breackfast', 'lunch', 'dinner', 'desserts', 'baking', 'salads', 'meat'];

    // const activeStyle =

    const handleCatSelected = (i) => {
        setActiveCat(i);
    };

    const handleCardClicked = (item) => {
        const url = `/details/${item.id || ''}`;
        navigate(url, { state: { data: item } });
    };

    useEffect(() => {
        const getRecipes = async () => {
            const recipes = await supa.from('recipes').select();
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

    return (
        <div className={nn.container}>
            <div className={nn.top}>
                <div className={nn.top_container}>
                    <div className={nn.option_container}>
                        <div className={nn.logo}>RECIPO</div>
                        {/* {options.map((option, i) => {
                            return (
                                <button
                                    onClick={() => handleCatSelected(i)}
                                    key={option}
                                    style={
                                        activeCat === i
                                            ? {
                                                  backgroundColor: 'var(--nn-lightBlue)',
                                                  color: 'var(--nn-blue)',
                                                  borderColor: 'var(--nn-blue)',
                                              }
                                            : {}
                                    }
                                    className={nn.option}
                                >
                                    {option}
                                </button>
                            );
                        })} */}
                    </div>
                    <button className={nn.see_more}>
                        {' '}
                        Recommended <FaChevronRight />
                    </button>
                </div>
                <hr className={nn.line} />
            </div>
            <div className={nn.bottom}>
                {data && data.length ? (
                    data.map((item, i) => {
                        return (
                            <CardComponent
                                key={i}
                                idx={item.id}
                                title={item.name}
                                energy={item.calories}
                                time={item.cookTime}
                                image={item?.images[0] || person}
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

export default RecipePage;
