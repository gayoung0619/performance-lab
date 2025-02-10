# sukyung 작업

## 2월 첫째주 성능 최적화 과제 : 가상 스크롤

### 1. 문제 상황

학교를 선택하는 셀렉박스 컴포넌트를 렌더링하는데, 학교 목록이 10만개가 넘어갔다.
10만개가 넘는 학교 이름을 전부 렌더링하는 것은 성능상 효율적이지 못하다고 판단했다.
lighthouse로 성능을 측정했을때 아래와 같은 점수가 나왔다.

### 2. 문제 해결

#### 2-1. 가상 스크롤 적용

모든 데이터를 렌더링하는 것이 아닌, 화면에 보이는 부분만큼 렌더링한다.
스크롤시 자연스럽게 전후 데이터들이 보여지기 위해서는 앞뒤로 5개 정도 미리 렌더링을 해두었다.

우선, 학교 목록을 감싸는 태그에 미리 높이값을 지정해준다. (참고로, 학교 이름을 담고 있는 아이템은 높이값이 20px로 고정했다.)
20px \* 학교 목록의 갯수
화면에 보여질 갯수 + 앞뒤 5개 정도가 보여져야 할텐데, 학교 목록에서 어디서부터 어디까지 렌더링할건지 정하는 startIdx와 endIdx는 스크롤된 크기에 따라 정해진다.

```
const startIdx = Math.max(0, Math.floor(scrollTop / 20) - 5); // startIdx는 총 학교 목록의 인덱스가 0부터 존재하니 0보다 작아질 수 없다.
const endIdx = Math.min(
totalItems - 1,
Math.ceil((scrollTop + CONTAINER_HEIGHT) / 20) + 5
); // 스크롤된 크기를 통해 구한 endIdx는 총 학교 목록의 갯수보다 더 커질 수 없다

const visibleItems = [];
for (let i = startIdx; i <= endIdx; i++) {
visibleItems.push({
index: i,
top: i \* 20,
});
}

...
return
...
{visibleItems.map(({ index, top }) => (

  <div
    key={schoolList?.data[index].id}
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
...
```

#### 2-2. 가상 스크롤 적용의 결과

: 점수가 2배 올랐다. 그러나, FCP와 LCP 점수가 현저히 낮다는 문제가 있었다.

#### 2-3. FCP, LCP 개선

FCP, LCP 개선시키기 위해서

1. 스켈레톤 적용

2. throttle 적용

두 가지 방법을 사용해봤지만 점수는 그대로 였고 오히려 FCP, LCP 시간이 미세하게 늘어났었다.

#### 2-4. FCP, LCP 점수 해결

: FCP, LCP 개선시키기 위해서 항상 제일 먼저 나오는 해결법은 js 파일과 css 파일 경량화이다.
로컬 환경에서는 빌드된 파일로 실행시키는 것이 아니기 때문에 FCP, LCP를 개선시킨 점수를 확인할 수 없다고 판단했고 빌드된 파일로 측정해야겠다고 생각했다.
그 결과, 크게 개선된 점수를 받을 수 있었다.

또한, 어떤 블로그에서 시크릿 모드에서 빌드된 것으로 실행시켜야 한다는 글을 찾았다. [참고한 블로그](https://always-hyeppy.tistory.com/entry/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EC%84%B1%EB%8A%A5CLS-LCP-%EA%B0%9C%EC%84%A0%ED%95%98%EA%B8%B0)
