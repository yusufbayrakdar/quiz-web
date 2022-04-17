import { Card } from "antd";
import React, { useState } from "react";
import Question from "../Question";
import styled from "styled-components";
import useRedux from "../../hooks/useRedux";
import { useSelector } from "react-redux";

const Info = ({ title, value }) => (
  <div className="info">
    <div className="title gBold">{title}</div>
    <div className="value gMed">{value}</div>
  </div>
);

function QuestionCard({ question, selectable = true }) {
  const { dispatchAction, $ } = useRedux();
  const activeQuiz = useSelector((state) => state.quiz.activeQuiz);

  const isSelected = activeQuiz?.questionSet?.has(question._id);
  const toggleSelect = () => {
    if (selectable) {
      dispatchAction(
        isSelected ? $.REMOVE_QUESTION_FROM_QUIZ : $.ADD_QUESTION_TO_QUIZ,
        question._id
      );
    }
  };
  return (
    <Styled
      selected={isSelected}
      onClick={toggleSelect}
      cover={
        <div className="question-container">
          {selectable && (
            <div className="checkbox">
              <div className="check-icon" />
            </div>
          )}
          <Question
            questionListItem={question}
            showMode={true}
            withoutCard={true}
          />
        </div>
      }
    >
      <Info title="Kategori" value={question?.category} />
      <Info title="Sınıf" value={question?.grade} />
      <Info title="Süre" value={question?.duration} />
    </Styled>
  );
}

const Styled = styled(Card)`
  max-width: 30vw;
  height: 100%;
  cursor: pointer;
  .question-container {
    position: relative;
    padding-top: 20px;
    padding-bottom: 10px;
    height: 15vw;
    background-color: ${({ theme }) => theme.colors.nestGray};
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .info {
    margin: 12px 0;
  }
  .title {
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.darkPrimary};
  }
  .value {
    font-size: 14px;
    font-weight: 400;
    line-height: 7px;
    color: ${({ theme }) => theme.colors.deepDarkGray};
  }
  .checkbox {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 2vw;
    height: 2vw;
    border-radius: 50%;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme, selected }) =>
      selected ? theme.colors.primary : theme.colors.gray};
    box-sizing: border-box;
    overflow: hidden;
    z-index: 1;
  }
  .check-icon {
    clip-path: polygon(19% 39%, 11% 49%, 46% 80%, 85% 21%, 74% 15%, 44% 55%);
    background-color: ${({ theme }) => theme.colors.gray};
    width: 100%;
    height: 100%;
  }
`;

export default QuestionCard;
