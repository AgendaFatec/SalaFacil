


export interface IMicrosoftProfile{
    oid: string,
    userName:string,
    email:string[],
    preferred_username: string
    accessToken?:string
    photoUser?: string
}