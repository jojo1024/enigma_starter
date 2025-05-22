import { useNavigate, useRoutes } from "react-router-dom";
import SideMenu from "../layouts/SideMenu";
import Chambres from "../pages/Chambres";
import Clients from "../pages/Clients";
import Dashbord from "../pages/Dashbord";
import Reservations from "../pages/Reservations";
import Residences from "../pages/Residences";
import Utilisateurs from "../pages/Utilisateurs";
import ConfigurationsChambre from "../pages/ConfigurationsChambre";
import { useEffect, useState } from "react";
import { useAppSelector } from "../stores/store";
import { selectConnectionInfo, selectIsLoggedIn } from "../stores/slices/appSlice";
import UpdatePassword from "../pages/Login/UpdatePassword";
import Login from "../pages/Login";

function Router() {
  const navigate = useNavigate()

  const connectionInfo = useAppSelector(selectConnectionInfo)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const [doitChangerDeMotdepasse, setDoitChangerDeMotdepasse] = useState(false)
  const [utilisateurId, setUtilisateurId] = useState(0)

  // Si l'utilisateur n'est pas un admin toujours le redirger vers la gestion des commandes
  useEffect(() => {
    if (!(connectionInfo?.roleUtilisateurNom === "ADMIN")) return navigate("/reservations")
  }, [])
  const routes = [
    {
      path: "/",
      element: <SideMenu />,
      children: [
        {
          path: "/",
          element: <Dashbord />,
        },
        {
          path: "residences",
          element: <Residences />,
        },
        {
          path: "config-chambres",
          element: <ConfigurationsChambre />,
        },
        {
          path: "chambres",
          element: <Chambres />,
        },
        {
          path: "reservations",
          element: <Reservations />,
        },
        // {
        //   path: "clients",
        //   element: <Clients />,
        // },
        {
          path: "utilisateurs",
          element: <Utilisateurs />,
        },
      ],
    },
  ];

  return (
    !isLoggedIn && !connectionInfo?.utilisateurNom
      ?
      // Rendre le composant Login si l'utilisateur n'est pas connecté
      doitChangerDeMotdepasse
        ?
        <UpdatePassword utilisateurId={utilisateurId} setDoitChangerDeMotdepasse={setDoitChangerDeMotdepasse} />
        :
        <Login setUtilisateurId={setUtilisateurId} setDoitChangerDeMotdepasse={setDoitChangerDeMotdepasse} />
      :
      // Utiliser les routes si l'utilisateur est connecté
      useRoutes(routes));
}

export default Router;
