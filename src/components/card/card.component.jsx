import nn from './card.module.css';
import { empty_recipe } from '../../assets';
import { FaClockRotateLeft, FaFire, FaHeart } from 'react-icons/fa6';
import { useDesktopContext } from '../../screen/desktop/desktop.context';
import { useEffect, useState } from 'react';
import { get_reci_user, getUserInfo, supa } from '../../db/supa';

const CardComponent = ({ onLike, onClick, title, energy, time, image = empty_recipe, idx }) => {
    const context = useDesktopContext();
    const [liked, setLiked] = useState('var(--nn-white)');
    const [hasLoaded, setHasLoaded] = useState(false);
    console.log(idx)

    const handleLiked = async () => {
        if (hasLoaded) {
            if (liked === 'var(--nn-grey)') {
                setLiked('var(--danger)');
                const userId = getUserInfo()?.id;
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
                const userId = getUserInfo()?.id;
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
        <div className={nn.container}>
            <FaHeart onClick={handleLiked} size={20} color={liked} className={nn.like_icon} />
            <div onClick={onClick}>
                <img className={nn.card_img} src={image} alt="product" />
                <div className={nn.title}>{title}</div>
                <div className={nn.bottom}>
                    <span className={nn.bullet}>
                        <FaFire /> {energy} Kcal
                    </span>
                    <span className={nn.bullet}>
                        <FaClockRotateLeft /> {time} mins
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CardComponent;
