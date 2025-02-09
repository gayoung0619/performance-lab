import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {getSchoolList} from "../api/school";
import styled from "styled-components";

const SchoolSelector = () => {
  const { data: schoolList, isLoading } = useQuery({
    queryKey: ["schoolList"],
    queryFn: () => getSchoolList(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  return (
      <div>
        {isLoading ? (
            <p>Loading...</p>
        ) : (
            <>
              <SchoolList>
                {schoolList?.data.map((ele, idx) => (
                    <div>{ele.name}</div>
                ))}
              </SchoolList>
            </>

        )}
      </div>
  );
};
const SchoolList = styled.div`
    height: 500px;
    overflow: scroll;
    > div {
        height: 200px;
        background: green;
        margin-top: 10px;
    }
`
export default SchoolSelector;
