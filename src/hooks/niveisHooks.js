import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, QUERYCLIENT } from "../services";

export const useBuscarNiveis = () => {
    return useQuery({ //utilizado pra buscar
        queryKey: ["niveis"], //onde a requisição será armazenada
        queryFn: async () => {
            const res = await AXIOS.get("/niveis")
            return res.data;
        }
     });
}

export const useCriarNiveis = () => {
    return useMutation({
        queryFn: async () => {
            const res = await AXIOS.post("/niveis");
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["niveis"]
            })
        }
     });
}

export const useEditarNiveis = () => {
    return useMutation({
        queryFn: async (dados, id) => {
            const res = await AXIOS.put(`/niveis/${id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["niveis"]
            })
        }
     });
}

export const useDeletarNiveis = () => {
    return useMutation({
        queryFn: async (id) => {
            const res = await AXIOS.delete(`/niveis/${id}`);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["niveis"]
            })
        }
     });
}