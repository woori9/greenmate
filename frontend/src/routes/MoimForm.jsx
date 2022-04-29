import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 400;
  margin: 1rem 0.5rem;
`;

function MoimForm() {
  function handleSubmit(event) {
    event.preventDefault();
    console.log(`모임 제목 : ${event.target[0].value}`);
  }

  return (
    <>
      <Title>그린메이트</Title>
      <Form onSubmit={event => handleSubmit(event)}>
        <label htmlFor="title">
          모임 제목
          <input type="text" id="title" />
        </label>
        <label htmlFor="restaurant">
          장소
          <input type="text" id="restaurant" />
        </label>
        <label htmlFor="time">
          모임 날짜
          <input type="time" min="04:00" step="600" id="time" />
        </label>
        <label htmlFor="count">
          인원
          <input type="number" id="count" />
        </label>
        <textarea />
        <button type="submit">작성</button>
      </Form>
    </>
  );
}

export default MoimForm;
