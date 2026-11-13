import { useQuery } from "@tanstack/react-query"
import { AXIOS } from "../services";

export const useBuscarNiveis = () => {
    return useQuery({ //utilizado pra buscar
        queryKey: ["niveis"],
        queryFn: async () => {
            const res = await AXIOS.get("/niveis")
            return res.data;
        }
     });
}