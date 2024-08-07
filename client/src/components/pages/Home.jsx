import { useContext, useEffect } from "react"
import { Context } from "../../context/Context";
import DesignCard from "../parts/DesignCard";

function Home() {

  const { fetchRecentDesigns, recentDesigns, fetchAllDesignsLoading } = useContext(Context);

  useEffect(() => {

    fetchRecentDesigns();
  }, [fetchRecentDesigns])

  return (
    <main className="px-10">
      <h1 className="text-2xl py-4 font-medium">Recents Designs</h1>
      <div className="grid grid-cols-3 gap-3 ">
        {
          !fetchAllDesignsLoading && recentDesigns.map((design, index) => (
            <DesignCard design={design} key={index} />
          ))
        }
      </div>
    </main>
  )
}

export default Home