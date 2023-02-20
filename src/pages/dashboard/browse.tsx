import AssetBrowser from "components/assetBrowser";
import DashboardLayout from "components/dashboardLayout";

function Browse(props) {
  return <AssetBrowser {...props} height="95vh" />;
}

Browse.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Browse;
