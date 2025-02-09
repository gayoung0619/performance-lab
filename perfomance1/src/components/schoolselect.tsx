import { useQuery } from '@tanstack/react-query';
import { getSchoolList } from '../api/school';
import styled from 'styled-components';
import { useRef, useState } from 'react';

const SchoolSelector = () => {
  const { data: schoolList, isLoading } = useQuery({
    queryKey: ['schoolList'],
    queryFn: () => getSchoolList(),
    staleTime: 24 * 60 * 60 * 1000,
  });
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  if (isLoading) return <p>Loading...</p>;

  const totalItems = schoolList?.data.length;
  const containerHeight = 320;
  const totalHeight = totalItems * 20;

  const startIdx = Math.max(0, Math.floor(scrollTop / 20) - 5);
  const endIdx = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / 20) + 5
  );

  const visibleItems = [];
  for (let i = startIdx; i <= endIdx; i++) {
    visibleItems.push({
      index: i,
      top: i * 20,
    });
  }

  const handleListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <SchoolListWrapper ref={containerRef} onScroll={handleListScroll}>
      <div
        style={{
          height: totalHeight,
          position: 'relative',
        }}
      >
        {visibleItems.map(({ index, top }) => (
          <div
            key={index}
            className="item_list"
            style={{
              position: 'absolute',
              top,
              height: '20px',
              width: '100%',
            }}
          >
            {schoolList?.data[index].name}
          </div>
        ))}
      </div>
    </SchoolListWrapper>
  );
};
const SchoolListWrapper = styled.div`
  position: relative;
  height: 300px;
  overflow: auto;
  .item_list {
    min-height: 20px;
  }
`;
export default SchoolSelector;
