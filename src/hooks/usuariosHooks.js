import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, QUERYCLIENT } from "../services"

export const useLogin = () => {
    return useMutation({ //retorna uma promessa
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/login", dados);
            return res.data;
        }
    })
}

export const useBuscarUsuarios = () => {
    return useQuery({
        queryKey: ["usuarios"],
        queryFn: async () => {
            const res = await AXIOS.get("/usuarios");
            return res.data;
        }
    })
}

export const useCriarUsuarios = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/usuarios", dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({ //invalida a consulta anterior de usuários e refaz
                queryKey: ["usuarios"]
            })
        }
    })
}

export const useEditarUsuarios = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.put(`/usuarios/${dados.id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["usuarios"]
            })
        }
    })
}

export const useDeletarUsuarios = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/usuarios/${id}`);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["usuarios"]
            })
        }
    })
}