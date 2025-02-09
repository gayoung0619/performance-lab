import React, {useEffect, useRef, useState} from "react";
import { useQuery } from "@tanstack/react-query";
import {getSchoolList} from "../api/school";
import styled from "styled-components";
import { useWindowScroll, useWindowSize } from "react-use";

const SchoolSelector = () => {
  const itemHeight = 300;
  const columnGap = 10;
  const { height } = useWindowSize();
  const { y } = useWindowScroll();

  const { data: schoolList, isLoading } = useQuery({
    queryKey: ["schoolList"],
    queryFn: () => getSchoolList(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [viewportY, setViewportY] = useState(0);

  // **스크롤 위치(y)**와 **요소의 초기 뷰포트 위치(viewportY)**의 차이값.
  // 스크롤 위치가 요소 위쪽 기준으로 얼마나 떨어져 있는지를 의미.
  const relativeY = y - viewportY;

  useEffect(() => {
    if (scrollRef.current) {
      const viewportY = scrollRef.current.getBoundingClientRect().y;
      setViewportY(viewportY);
    }
  }, []);

  // 전체 데이터의 높이를 계산 (항목 높이 + 간격) × 항목 개수.
  // → 이는 전체 스크롤 영역의 높이를 설정하는 데 사용될 수 있음.
  const containerHeight = (itemHeight + columnGap) * schoolList?.data.length

  // 현재 뷰포트의 첫 번째로 보이는 항목의 인덱스를 계산.
  // **relativeY**가 항목의 높이와 간격으로 나누어져 몇 번째 항목이 보이는지 구함.
  const startIndex = Math.max(
      Math.floor(relativeY / (itemHeight + columnGap)), 0
  )

  // 현재 뷰포트에서 보이는 마지막 항목의 인덱스를 계산.
  // 창의 높이 (height)를 기준으로 몇 개의 항목이 추가로 보일 수 있는지 계산.
  const endIndex = Math.min(
      Math.ceil(height / (itemHeight + columnGap) + startIndex), schoolList?.data.length
  )

  // 보이는 항목만 배열에서 잘라서 렌더링.
  const visibleItem = schoolList?.data.slice(
      Math.max(startIndex, 0),
      Math.min(endIndex + 1, schoolList?.data.length)
  )

  // 보이는 항목들의 렌더링 시작 위치를 설정하기 위한 값.
  // startIndex 기준으로 항목 높이와 간격을 곱해 위치 조정.
  const translateY = Math.max((itemHeight + columnGap) * startIndex, columnGap);


  return (
      <div>
        {isLoading ? (
            <p>Loading...</p>
        ) : (
            <SchoolList ref={scrollRef} style={{height: `${containerHeight}px`}}>
              <div style={{ transform : `translateY(${translateY}px)` }}>
                {visibleItem?.map((ele, idx) => (
                    <div
                        key={idx}
                        style={{
                          height: `${itemHeight}px`,
                          marginTop: `${columnGap}px`,
                          background: "green",
                        }}
                    >
                      {ele.name}
                    </div>
                ))}
              </div>
            </SchoolList>

        )}
      </div>
  );
};
const SchoolList = styled.div`
    > div {
        height: auto;
    }
`
export default SchoolSelector;
