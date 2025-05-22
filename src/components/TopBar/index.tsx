import clsx from "clsx";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoUrl from "../../assets/images/logo.svg";
import Breadcrumb from "../../base-components/Breadcrumb";
import { Menu } from "../../base-components/Headless";
import Lucide from "../../base-components/Lucide";
import fakerData from "../../utils/faker";
import { useAppDispatch, useAppSelector } from "../../stores/store";
import { selectConnectionInfo, setUserLoggedOut } from "../../stores/slices/appSlice";

function Main(props: { layout?: "side-menu" | "simple-menu" | "top-menu" }) {

  const dispatch = useAppDispatch()
  const connectionInfo = useAppSelector(selectConnectionInfo)  // Hooks
  console.log("🚀 ~ Main ~ connectionInfo:", connectionInfo)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      navigate('/')
      dispatch(setUserLoggedOut())
    } catch (error) {
      console.log("🚀 ~ handleLogout ~ error:", error)
    }
  }
  return (
    <>
      <div
        className={clsx([
          "h-[70px] md:h-[65px] z-[51] border-b border-white/[0.08] mt-12 md:mt-0 -mx-3 sm:-mx-8 md:-mx-0 px-3 md:border-b-0 relative md:fixed md:inset-x-0 md:top-0 sm:px-8 md:px-10 md:pt-10 md:bg-gradient-to-b md:from-slate-100 md:to-transparent dark:md:from-darkmode-700",
          props.layout == "top-menu" && "dark:md:from-darkmode-800",
          "before:content-[''] before:absolute before:h-[65px] before:inset-0 before:top-0 before:mx-7 before:bg-primary/30 before:mt-3 before:rounded-xl before:hidden before:md:block before:dark:bg-darkmode-600/30",
          "after:content-[''] after:absolute after:inset-0 after:h-[65px] after:mx-3 after:bg-primary after:mt-5 after:rounded-xl after:shadow-md after:hidden after:md:block after:dark:bg-darkmode-600",
        ])}
      >
        <div className="flex items-center h-full">
          {/* BEGIN: Logo */}
          <Link
            to="/"
            className={clsx([
              "-intro-x hidden md:flex",
              props.layout == "side-menu" && "xl:w-[180px]",
              props.layout == "simple-menu" && "xl:w-auto",
              props.layout == "top-menu" && "w-auto",
            ])}
          >
            <img
              alt="Pools Résidences Tailwind HTML Admin Template"
              className="w-6"
              src={logoUrl}
            />
            <span
              className={clsx([
                "ml-3 text-lg text-white",
                props.layout == "side-menu" && "hidden xl:block",
                props.layout == "simple-menu" && "hidden",
              ])}
            >
              {" "}
              Pools Résidences{" "}
            </span>
          </Link>
          {/* END: Logo */}
          {/* BEGIN: Breadcrumb */}
          <Breadcrumb
            light
            className={clsx([
              "h-[45px] md:ml-10 md:border-l border-white/[0.08] dark:border-white/[0.08] mr-auto -intro-x",
              props.layout != "top-menu" && "md:pl-6",
              props.layout == "top-menu" && "md:pl-10",
            ])}
          >
            <Breadcrumb.Link to="/">Application</Breadcrumb.Link>
            <Breadcrumb.Link to="/" active={true}>
              Dashboard
            </Breadcrumb.Link>
          </Breadcrumb>
          {/* END: Breadcrumb */}
          {/* BEGIN: Search */}
          <div className="relative mr-3 intro-x sm:mr-6">

            <a className="relative text-white/70 sm:hidden" href="">
              <Lucide icon="Search" className="w-5 h-5 dark:text-slate-500" />
            </a>

          </div>

          {/* END: Notifications */}
          {/* BEGIN: Account Menu */}
          <Menu>
            <Menu.Button className="block w-8 h-8 overflow-hidden rounded-full shadow-lg image-fit zoom-in intro-x">
              <img
                alt="Midone Tailwind HTML Admin Template"
                src={fakerData[9].photos[0]}
              />
            </Menu.Button>
            <Menu.Items className="w-56 mt-px relative bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
              <Menu.Header className="font-normal">
                <div className="font-medium">{connectionInfo?.utilisateurNom}</div>
                <div className="text-xs text-white/70 mt-0.5 dark:text-slate-500">
                  {connectionInfo?.roleUtilisateurNom}
                </div>
              </Menu.Header>

              <Menu.Item className="hover:bg-white/5" onClick={handleLogout}>
                <Lucide icon="ToggleRight" className="w-4 h-4 mr-2" /> Déconnexion
              </Menu.Item>
            </Menu.Items>
          </Menu>
          {/* END: Account Menu */}
        </div>
      </div>
    </>
  );
}

export default Main;
