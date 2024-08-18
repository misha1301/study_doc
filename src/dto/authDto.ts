import * as yup from 'yup';

export const loginDto = yup.object().shape({
        username: yup
            .string()
            .when('email', {
                is: (email: string | undefined) => !email || email.length === 0,
                then: (schema: yup.StringSchema) => schema.required('errors:request.NO_USERNAME_OR_EMAIL')
            }),
        email: yup
            .string()
            .when('username', {
                is: (username: string | undefined) => !username || username.length === 0,
                then: (schema: yup.StringSchema) => schema.required('errors:request.NO_USERNAME_OR_EMAIL')
            }),
        password: yup
            .string()
            .required('errors:request.NO_PASSWORD')
    },
    [
        ["email", "username"]
    ]);

export const signUpDto = yup.object().shape({
        username: yup
            .string()
            .required('errors:request.NO_USERNAME'),
        email: yup
            .string()
            .required('errors:request.NO_EMAIL'),
        password: yup
            .string()
            .required('errors:request.NO_PASSWORD')
    });

export const changePwdDto = yup.object().shape({
    newPassword: yup
        .string()
        .required('errors:request.NO_NEW_PASSWORD'),
    password: yup
        .string()
        .required('errors:request.NO_PASSWORD')
});

export type LoginSchema = yup.InferType<typeof loginDto>;
export type SingUpSchema = yup.InferType<typeof signUpDto>;
export type ChangePwdSchema = yup.InferType<typeof changePwdDto>;