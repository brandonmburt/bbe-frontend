export interface SignUpProps {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    rememberMe?: boolean,
}

export interface UserProps {
    email: string,
    role: string;
    loggedIn: boolean;
    loading: boolean;
    error: string,
}