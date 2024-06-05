import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import Header from "../commons/header";
import Footer from "../../../component/footer";
import RctPageLoader from "../../../component/RctPageLoader";
import { getAllFavorites, getUserCategories, getuserData } from "../../../services/homeService";
import { useNavigate } from "react-router-dom";
import defultUser from "../../../assets/images/defultUser.png";
import "react-toastify/dist/ReactToastify.css";
import { favoritePageData, reset_favorite_scroll_position, set_favorite_page_scroll_position, set_favorite_persist_page_data, set_favorite_persist_page_no } from "../../../reducer/favoritePageSlice";
import { faAngleDown, faAngleUp, faHeart, faMessage, faPhone, faTty, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from '@fortawesome/fontawesome-free-regular';
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import twoWayVideo from "../../../assets/images/twoWayVideo.svg";

const Favorites: React.FC<any> = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [clientsDetails, setClientsDetails] = useState<any>([]);
  const [categories, setcategories] = useState<any>([]);
  const [selectCat, setSelectCat] = useState<any>("cat");
  const [filterBody, setFilterBody] = useState<any>({
    sort: [{ selector: "created", desc: true }],
    requireTotalCount: true,
  });
  const navigate = useNavigate();
  const persistDispatch = useDispatch();
  const restorationRef = React.useRef<null | HTMLDivElement>(null);
  const { favoritePageScrollPosition } = useSelector(favoritePageData);
  const [selectedCategory, setSelectedCategory] = useState<any>({
    name: null,
    index: null,
    isDropDownOpen: false,
    subcategories: null
  })
  const [refetchClientData, setRefetchClientData] = useState(false);

  useEffect(() => {
    const onBeforeUnload = (ev: any) => {
      window.scrollTo(0, 0)
      persistDispatch(set_favorite_persist_page_no(null))
      persistDispatch(set_favorite_persist_page_data(null))
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  useEffect(() => {
    const { dispatch } = props;
    setLoading(true);
    dispatch(getAllFavorites())
      .then((res: any) => {
        setClientsDetails(res.data.data);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
      });
    getCategoriesList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (favoritePageScrollPosition && restorationRef && restorationRef?.current && clientsDetails?.length) {
      restorationRef?.current?.scrollIntoView({ behavior: 'instant' as any, block: 'center', inline: 'start' })
      persistDispatch(reset_favorite_scroll_position())
    }
  }, [favoritePageScrollPosition, restorationRef, clientsDetails]);

  const getCategoriesList = () => {
    const { dispatch } = props;
    dispatch(getUserCategories(true))
      .then((res: any) => {
        setcategories(res?.data);
      })
      .catch((err: any) => {
        console.log("dfsdgh", err);
      });
  };

  const onRedirectProfile = (data: any) => {
    persistDispatch(set_favorite_page_scroll_position(data?.id))

    navigate(`/user/profileDetails/${data?.uniqueUsername}`);
  };

  const getFavoriteFriendDetails = () => {
    setLoading(true);
    const { dispatch } = props;
    dispatch(getAllFavorites({...filterBody, categories2: selectedCategory?.name ? [{ name: selectedCategory?.name, subcategories: [selectedCategory?.subcategories ?? ''] }] : []}))
      .then((res: any) => {
        setLoading(false);
        setClientsDetails(res.data.data);
        setRefetchClientData(false)
      })
      .catch((err: any) => {
        setLoading(false);
        setRefetchClientData(false)
      });
  };

  const ongoTocategory = (cat: any) => {
    const tempFilterBody = filterBody;
    tempFilterBody["filter"] = [["categories", "contains", `#${cat?.name}`]];
    setFilterBody(tempFilterBody);
    getFavoriteFriendDetails();
    setSelectCat(cat?.name);
  };

  const ongoTocategoryAll = () => {
    setSelectedCategory({
      name: null,
      index: null,
      isDropDownOpen: false,
      subcategories: null
    })
    setRefetchClientData(true)
  };

  const onSubCatClick = (e: any, subCat: any) => {
    e.preventDefault()
    e.stopPropagation()
    if (!subCat) {
      setSelectedCategory({ ...selectedCategory, subcategories: null })
    } else {
      setSelectedCategory({ ...selectedCategory, subcategories: subCat })
      setSelectedCategory({ ...selectedCategory, isDropDownOpen: false, subcategories: subCat });
      setTimeout(() => {
        setSelectedCategory({ ...selectedCategory, index: null, isDropDownOpen: false, subcategories: subCat });
      }, 1200);
    }

    setRefetchClientData(true)
  }

  useEffect(() => {
    if (categories.length) {
      const scroller: any = document.querySelector(".scroll-wrap");
      const dropDown: any = document.querySelectorAll(".dropdown");

      const checkScroll = () => {
        for (let i = 0; i < dropDown.length; i++) {
          dropDown[i].style.transform = "translateX(-" + scroller.scrollLeft + "px)";
        }
      };

      scroller.addEventListener("scroll", checkScroll);

      return () => {
        scroller.removeEventListener("scroll", checkScroll);
      };
    }
  }, [categories]);
  
  useEffect(() => {
    if (refetchClientData) {
      setClientsDetails([])
      getFavoriteFriendDetails()
    }
  }, [refetchClientData])

  const onCategoryClick = (index: any, subcategories: any) => {
    if (!subcategories?.length) {
      setSelectedCategory({ name: categories[index].name, index: index, isDropDownOpen: false, subcategories: null });
      setRefetchClientData(true)
    } else if (selectedCategory?.name !== categories[index].name) {
      setSelectedCategory({ name: categories[index].name, index: index, isDropDownOpen: false, subcategories: null });

      setTimeout(() => {
        setSelectedCategory({ name: categories[index].name, index: index, isDropDownOpen: true, subcategories: null });
        setRefetchClientData(true)
      }, 10)
    } else {
      if (!selectedCategory?.isDropDownOpen) {
        setSelectedCategory({ ...selectedCategory, name: categories[index].name, index: index, isDropDownOpen: false });
        setTimeout(() => {
          setSelectedCategory({ ...selectedCategory, name: categories[index].name, index: index, isDropDownOpen: true });
        }, 10)

      } else {
        setSelectedCategory({ ...selectedCategory, index: index, isDropDownOpen: false, name: categories[index].name });
        setTimeout(() => {
          setSelectedCategory({ ...selectedCategory, index: null, name: categories[index].name, isDropDownOpen: false });
        }, 10);
      }
    }
  }
  return (
    <>
      {loading && <RctPageLoader />}
      <div className="bg-[#F8F3FD] min-h-screen">
        <Header />
        <div className="body-section">
          <div className={`min-h-screen`}>
            <div className="md:block antialiased min-h-screen text-gray-900 md:px-6 py-6 max-h-[60%] overflow-y-auto">
              <div className="">
                <div className="text-primary test-[30px] font-bold mb-6">
                  My Favorites
                </div>

                <div id="scroll-wrap" className="scroll-wrap overflow-auto flex py-2 smallScroll">
                  {categories?.length ?
                    <>
                      <div className={`cursor-pointer text-md min-w-fit px-6 border-2 border-primary flex items-center font-semibold place-content-center py-4 rounded-full text-[14px] w-44 mr-3 ${!selectedCategory?.name ? "bg-primary text-white" : "bg-transparent text-primary"}`} onClick={() => ongoTocategoryAll()}>
                        All categories
                      </div>

                      {categories.map((category: any, index: any) => (
                        <>
                          <div className={`group cursor-pointer min-w-fit border-2 border-primary flex font-semibold place-content-center py-4 rounded-full text-[14px] w-44 mr-3 ${selectedCategory?.name === category?.name ? 'bg-primary' : 'bg-transparent'}`} onClick={() => onCategoryClick(index, category?.subcategories)}>
                            <div className={`text-primary font-semibold px-6 text-md flex items-center ${selectedCategory?.name === category?.name ? 'text-white' : 'text-primary'}`}>
                              <div>{category.name}</div>
                              {category?.subcategories?.length ?
                                <div><FontAwesomeIcon icon={(selectedCategory?.index === index && selectedCategory?.isDropDownOpen) ? faAngleUp : faAngleDown} className="mt-1 ml-2 font-bold text-lg" /></div>
                                : null
                              }
                            </div>

                            <div className={`px-6 shadow-2xl py-3 w-max rounded-lg text-primary mt-12 bg-white dropdown transition-opacity duration-900 absolute z-[999] ease-linear ${selectedCategory?.isDropDownOpen ? 'opacity-1 ' : 'opacity-0'} ${selectedCategory?.index === index ? 'block' : 'hidden'}`}>
                              <div className={`text-center w-full mb-3 ${!selectedCategory?.subcategories ? 'font-extrabold' : ''}`} onClick={(e) => onSubCatClick(e, null)}>All</div>
                              {category?.subcategories?.map((subCat: any) => {
                                return (
                                  <>
                                    <div className={`text-center w-full mb-3 ${selectedCategory?.subcategories === subCat ? 'font-extrabold' : ''}`} onClick={(e) => onSubCatClick(e, subCat)}>{subCat}</div>
                                  </>
                                )
                              })}
                            </div>
                          </div>
                        </>
                      ))}
                    </>
                    : null
                  }
                </div>

                {clientsDetails.length === 0 ? (
                  <div className="px-4 mt-2 font-[Montserrat]">
                    {/* No client found. Enter username to connect. */}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-x-4 gap-y-8 2xl:gap-x-4 2xl:gap-y-8 mt-4">
                    <>
                      {clientsDetails.map((client: any) => {
                        return (
                          <div className="w-full" ref={favoritePageScrollPosition === client?.id ? restorationRef : null}>
                            <div
                              className="w-full max-w-[360px] h-[450px] mx-auto rounded-md shadow-lg bg-white"
                              onClick={() => onRedirectProfile(client)}
                            >
                              {client.profileImageUrl === null ||
                                client.profileImageUrl === "" ? (
                                <div className="w-[290px] h-[3200px]">
                                  <img
                                    className="w-full min-h-[320px] rounded-t-md"
                                    src={defultUser}
                                    alt="product"
                                  />
                                </div>
                              ) : (
                                <div className="relative h-[320px] overflow-hidden">
                                  <img
                                    className="w-full min-h-[320px] rounded-t-md"
                                    src={client.profileImageUrl}
                                    alt="clien profile"
                                  />
                                  <div className="absolute cursor-pointer right-3 top-3">
                                    {client.isFavorite ? (
                                      <FontAwesomeIcon icon={faHeart} className="text-3xl text-primary" />
                                    ) : (
                                      <FontAwesomeIcon icon={regularHeart as IconProp} className="text-3xl text-white" />
                                    )}
                                  </div>
                                </div>
                              )}
                              <div className="px-4 py-2">
                                <p className="text-base font-[Montserrat] font-semibold flex items-center">
                                  <span
                                    className={`w-[12px] h-[12px] rounded-full ${client.status === "Available"
                                      ? "bg-[#20B514]"
                                      : client.status === "Busy" ||
                                        client.status === "DoNotDisturb"
                                        ? "bg-[#E99312]"
                                        : "bg-[#EBEBEB]"
                                      } mr-2`}
                                  ></span>
                                  <p className="max-w-[90%] line-clamp-1 break-all">{client.username}</p>
                                </p>
                                <p
                                  className="text-[#000000] font-[Montserrat] text-[10px] overflow-hidden min-h-[45px]"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: "3",
                                    WebkitBoxOrient: "vertical",
                                  }}
                                >
                                  {client.description}
                                </p>
                                <div>Services</div>
                                <div className="grid grid-cols-5 gap-2">
                                  <div className="flex items-center">
                                    <FontAwesomeIcon icon={faMessage} className="text-primary" />
                                    <p className="ml-1 text-[#2F2F2F] font-bold text-[12px]">
                                      $
                                      {
                                        client?.communication?.shortMessageUnitPrice.toFixed(2) ?? 0
                                      }
                                    </p>
                                  </div>

                                  {client?.enablePhoneCall &&
                                    <div className="flex items-center">
                                      <FontAwesomeIcon icon={faTty} className="text-primary" />
                                      <p className="ml-1 text-[#2F2F2F] font-bold text-[12px]">
                                        $
                                        {
                                          client?.communication?.phoneCallUnitPrice.toFixed(2) ?? 0
                                        }
                                      </p>
                                    </div>
                                  }

                                  {client?.enableAudioCall &&
                                    <div className="flex items-center">
                                      <FontAwesomeIcon icon={faPhone} className="text-primary" />
                                      <p className="ml-1 text-[#2F2F2F] font-bold text-[12px]">
                                        $
                                        {
                                          client?.communication?.audioCallUnitPrice.toFixed(2) ?? 0
                                        }
                                      </p>
                                    </div>
                                  }


                                  {client?.enableOneWayVideoCall &&
                                    <div className="flex items-center">
                                      <FontAwesomeIcon icon={faVideo} className="text-primary" />

                                      <p className="ml-1 text-[#2F2F2F] font-bold text-[12px]">
                                        $
                                        {
                                          client?.communication?.videoCallOneWayUnitPrice.toFixed(2) ?? 0
                                        }
                                      </p>
                                    </div>
                                  }

                                  {client?.enableTwoWayVideoCall &&
                                    <div className="flex items-center">
                                      <img
                                        src={twoWayVideo}
                                        className="w-[18px] h-[18px]"
                                        alt="videochat"
                                      />
                                      <p className="ml-1 text-[#2F2F2F] font-bold text-[12px]">
                                        $
                                        {
                                          client?.communication?.videoCallTwoWayUnitPrice.toFixed(2) ?? 0
                                        }
                                      </p>
                                    </div>
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  </div>
                )}
                {/* {clientsDetails.length !== 0 && (
                  <div className="mt-16 mb-6 w-100 flex justify-center">
                    <button className="border border-2 border-primary rounded-full py-2 px-4 text-primary">
                      Load more
                    </button>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default connect()(Favorites);
