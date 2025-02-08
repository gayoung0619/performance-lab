import { useQuery } from '@tanstack/react-query';
import { getSchoolList } from '../api/school';
import styled from 'styled-components';
import { useState } from 'react';

const SchoolSelector = () => {
  const { data: schoolList, isLoading } = useQuery({
    queryKey: ['schoolList'],
    queryFn: () => getSchoolList(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const NODEPADDING = 10;
  const [scrollPos, setScrollPos] = useState(0);

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollPos(scrollTop);
    console.log(scrollTop);
  }

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <SchoolList onScroll={handleScroll}>
            {schoolList?.data.map((ele, idx) => (
              <div key={idx} data-value={idx} className="item_list">
                {scrollPos < 20 * (idx + NODEPADDING) &&
                  scrollPos + 320 > 20 * (idx - NODEPADDING) &&
                  ele.name}
              </div>
            ))}
          </SchoolList>
        </>
      )}
    </div>
  );
};
const SchoolList = styled.div`
  height: 300px;
  overflow: scroll;
  .item_list {
    min-height: 20px;
  }
`;
export default SchoolSelector;
