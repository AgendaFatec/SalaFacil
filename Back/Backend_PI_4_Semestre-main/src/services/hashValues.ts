import bcript from "bcrypt"
import type { HashPassword } from "../interfaces/tools/HashValues.js"





export class HashValues{
    async encryptPassword(UserPassword: string){
        try{
            const hashPassword = await bcript.hash(UserPassword, 12);
            console.log("teste")
            console.log(UserPassword + "\n" + typeof(UserPassword))
            console.log(hashPassword + "\n" + typeof(hashPassword))
        }
        catch(error){
            console.log(error )
            return error
        }
    }
}



// const passwordExample:string = "jhonibr4025"
// const testeHash = new HashValues()

// const res = () =>{
//     testeHash.encryptPassword(passwordExample)

// }
// console.log(res())

