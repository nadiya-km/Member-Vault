import api from "../../service/api";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => {
      setAdmin(res.data.admin);
    });
  }, []);

  return <h1>Welcome {admin?.email}</h1>;
};

export default Dashboard;
