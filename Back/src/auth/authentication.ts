import * as express from "express";
import { Security } from "@/utils/jtwUtils.js";
import {TokenPayload} from "@/interfaces/auth/TokenPayload.js"


export function expressAuthentication(
  request: express.Request,
  securityName: string,
  _scopes?: string[]
): Promise<any> {
  if (securityName === "jwt") {
    const authHeader = request.headers["authorization"];
    const queryToken = request.query?.token;

    let rawToken: string | undefined = Array.isArray(authHeader) 
        ? authHeader[0] 
        : authHeader;

    if (!rawToken && typeof queryToken === 'string') {
        rawToken = queryToken;
    }

    return new Promise((resolve, reject) => {
      if (!rawToken) {
        return reject(new Error("Token não fornecido"));
    }
    const cleanToken = rawToken.startsWith("Bearer ") 
        ? rawToken.split(" ")[1] || "" 
        : rawToken;

    if (!cleanToken || cleanToken.trim() === "") {
        return reject(new Error("Formato de token inválido ou vazio"));
    }

    const decoded = Security.verifyToken<TokenPayload>(cleanToken);

    if (!decoded) {
        return reject(new Error("Token inválido ou expirado"));
    }
    if (_scopes && _scopes.length > 0) {
        if (!_scopes.includes(decoded.role)) {
            console.warn(`Acesso negado: Usuário ${decoded.email} tentou acessar rota de ${_scopes}`);
            return reject(new Error("Você não tem permissão (role insuficiente) para esta rota"));
        }
    }

    resolve(decoded);
    });
  }
  return Promise.reject(new Error("Método de segurança não suportado"));
}