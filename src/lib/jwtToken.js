import { cookies } from 'next/headers';

export async function sendToken(user, statusCode = 200, msg = "Token sent", rest = {}) {
    const token = await user.getJwtToken(user._id.toString());

    const cookieStore =await cookies();
    cookieStore.set({
        name: 'token',
        value: token,
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/',
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)  // 90 days
    });

    return {
        success: true,
        message: msg,
        token,
        ...rest
    };
}
