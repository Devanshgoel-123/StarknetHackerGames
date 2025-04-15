import "./styles.scss";
import React, { useState, useEffect } from "react";
import MarketContainer from "./MarketContainer";
import { AgentArena } from "./AgentArena";
import axios from "axios";
import { useMemo } from "react";
import { DepositWithdrawPool } from "@/Components/Backend/Types";
import {
  Select,
  MenuItem,
  ThemeProvider,
  createTheme,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  useMediaQuery,
} from "@mui/material";
import { useAgentStore } from "@/store/agent-store";
import { BsLayoutTextSidebar } from "react-icons/bs";
import { BACKEND_URL } from "@/Components/Backend/Common/Constants";
import { CustomSpinner } from "@/Components/Backend/Common/CustomSpinner";
import { useShallow } from "zustand/react/shallow";

const YieldFarm = () => {
  const [protocol, setProtocol] = useState("All");
  const [data, setData] = useState<DepositWithdrawPool[]| null>(null);
  const [loading, setLoading] = useState(true);
  const {
    agentWalletAddress
  }=useAgentStore(useShallow((state)=>({
    agentWalletAddress:state.agentWalletAddress,
  })))
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#ffb400",
      },
      background: {
        default: "#121212",
        paper: "#1e1e1e",
      },
      text: {
        primary: "#ffffff",
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/depositWithdraw/pools`,{
          params:{
            agentWalletAddress:agentWalletAddress
          }
        });
        const responseData: DepositWithdrawPool[]= response.data.data;
        setData(responseData);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [agentWalletAddress]);

  const handleChange = (event: SelectChangeEvent) => {
    setProtocol(event.target.value);
  };

  const MobileDevice = useMediaQuery("(max-width:640px)");

  const filteredData = useMemo(() => {
    if (!data) return [];
    console.log("The data is",data)
  if (protocol === "All") {
    return data;
  } else if (protocol === "StrkFarm") {
    return data.filter((item) => item.protocol === "StrkFarm");
  } else if (protocol === "EndurFi") {
    return data.filter((item) => item.protocol === "EndurFi"); // Note: "EndurFi" vs "Endurfi" — ensure case matches backend!
  }
  return [];
  }, [data, protocol]);
 

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="yield-farm-container">
        {MobileDevice && (
          <div
            className="YieldSideBarIcon"
            onClick={() => {
              useAgentStore.getState().setOpenSideBar(true);
            }}
          >
            <BsLayoutTextSidebar />
          </div>
        )}
        <div className="parent-container">
          <FormControl className="dropdown-container" variant="filled">
            <InputLabel sx={{ color: "#ffb400" }}>Protocol</InputLabel>
            <Select
              value={protocol}
              onChange={handleChange}
              sx={{
                width: "250px",
                color: "#ffffff",
                backgroundColor: "#1e1e1e",
                borderRadius: "8px",
                fontSize: "18px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ffb400",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ffa726",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ff9800",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "#2c2c2c",
                    borderRadius: "8px",
                    "& .MuiMenuItem-root": {
                      padding: "20px 28px",
                      fontSize: "18px",
                      color: "#ffffff",
                      transition: "background 0.3s",
                    },
                    "& .MuiMenuItem-root:hover": {
                      backgroundColor: "#ffb400",
                      color: "#121212",
                    },
                  },
                },
              }}
            >
              {[
                { label: "All", value: "All" },
                { label: "EndurFi", value: "EndurFi" },
                { label: "StrkFarm", value: "StrkFarm" },
              ].map((item) => (
                <MenuItem
                  key={item.value}
                  value={item.value}
                  sx={{
                    padding: "20px 28px",
                    fontSize: "18px",
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {loading ? (
            <div className="spinner-container">
              <CustomSpinner size="60" color="#ffb400" />
            </div>
          ) : filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <MarketContainer key={index} data={item} />
            ))
          ) : (
            <p>No data available</p>
          )}
        </div>
        <AgentArena />
      </div>
    </ThemeProvider>
  );
};

export default YieldFarm;
