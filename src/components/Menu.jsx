import { ConfigProvider } from "antd";
import { NavLink } from "react-router";

const Menu = () => {
    return ( 
        <header className="w-55 h-screen bg-blue-500 p-4">
            <h1 className="text-4xl font-semibold text-white mb-5">Tetos</h1>
            <ConfigProvider
            theme={{
                token: {

                }
            }} 
            >
                <nav className="flex flex-col gap-2 *:leading-10 *:font-semibold *:text-white! *:hover:bg-white/25! *:rounded *:duration-200! *:ease-in-out! *:[&.active]:bg-white! *:[&.active]:text-blue-500! *:pl-4">
                    <NavLink end to="/dashboard">Home</NavLink>
                    <NavLink end to="/dashboard/niveis">Níveis</NavLink> {/* levar em consideração a última palavra da rota */}
                    <NavLink end to="/dashboard/imoveis-tipo">Tipos de imóvel</NavLink>
                </nav>
            </ConfigProvider>
        </header>
     );
}
 
export default Menu;