import { inject } from '@adonisjs/core'
import User from "#models/user";

@inject()
export default class UserService {

    constructor() { }


    async createUser(data: any) {
        try {
            const user = await User.create(data)

            //send a mail through a mail service


            return user
        } catch (error) {
            if (error.code === '23505') {
                return { error: 'Email already exists' }
            } else return { error: error }
        }
    }

    async login(data: any) {
        const user = await User.verifyCredentials(data.email, data.password)

        if (!user) {
            return { error: 'Invalid credentials' }
        }

        const token = await User.accessTokens.create(user)

        return {
            type: 'bearer',
            value: token.value!.release(),
        }
    }

    async updateUserById(id: number, data: any) {
        const user = await User.find(id);
        user?.merge(data);
        return await user?.save();
    }

    async deleteUserById(id: number) {
        const user = await User.find(id);
        return await user?.delete();
    }

    async getUserById(id: number) {
        try {
            return await User.find(id);
        } catch (error) {
            throw new Error('User not found');
        }

    }
    async getAllUsers() {

        return await User.all();
    }
}