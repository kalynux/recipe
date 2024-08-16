import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supa = createClient(supabaseUrl, supabaseKey);

export const saveUser = async ({ fullname, email, password }) => {
    const { data, error } = await supa.auth.updateUser({
        email,
        ...(password ? password : {}),
    });

    if (error) {
        return { error: error.message };
    }

    localStorage.setItem(
        'user',
        JSON.stringify({ ...data.user, fullname, email: data.user.new_email || data.user.email })
    );

    await supa.from('reci_user').update({ fullname }).eq('user_id', data.user.id);

    return { data };
    // localStorage.setItem('user_recipes', data.recipe);
};

export const set_reci_user = async ({ fullname, recipe }) => {
    const user_id = getUserInfo()?.id;
    if (!user_id) return;
    const { data, error } = await supa
        .from('reci_user')
        .upsert(
            [
                {
                    user_id,
                    fullname,
                    recipe,
                },
            ],
            { onConflict: ['user_id'] }
        )
        .select();
    if (error) {
        alert(error.message);
        return false;
    }

    return data;
    // localStorage.setItem('user_recipes', data.recipe);
};

export const get_reci_user = async () => {
    const userId = getUserInfo()?.id;
    if (!userId) return;
    console.log(userId);
    const { data, error } = await supa.from('reci_user').select().eq('user_id', userId);
    if (error) {
        alert(error.message);
        return false;
    }
    console.log(data);
    return data[0];
};

export const getUserInfo = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return {};
    return user;
};

export const savedUserLocally = ({ data, fullname }) => {
    const { access_token, refresh_token } = data.session;

    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);
    localStorage.setItem('user', JSON.stringify({ ...data.user, fullname }));
};

