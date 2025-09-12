import React from "react"
import styled, { css } from "styled-components"

const Timeline = styled.section`
  white-space: nowrap;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  position: relative;

  ol {
    font-size: 0;
    display: flex;
    align-items: center;
    padding: 250px 0;
    gap: 14px;
    position: relative;

    &::after {
      content: '';
      display: inline-block;
      width: 280px; /* mismo ancho del último div */
      flex-shrink: 0;
    }
  }

  ol li {
    position: relative;
    display: inline-block;
    list-style-type: none;
    width: 160px;
    height: 3px;
    background: #4DB6AC;
  }

  ol li:last-child {
    width: 280px;
  }

  ol li::after {
    content: '';
    position: absolute;
    top: 50%;
    left: calc(100% + 1px);
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #4DB6AC;
  }

  ol li:last-child::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
    width: 170px;
    height: 3px;
    background: #4DB6AC;
  }

  ol li div {
    position: absolute;
    left: calc(100% + 7px);
    width: 280px;
    padding: 15px;
    font-size: 1rem;
    white-space: normal;
    color: #E0E0E0;
    background: #37474F;
  }

  ol li div::before {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    width: 0;
    height: 0;
    border-style: solid;
  }

  ol li:nth-child(odd) div {
    top: -16px;
    transform: translateY(-100%);
  }

  ol li:nth-child(odd) div::before {
    top: 100%;
    border-width: 8px 8px 0 0;
    border-color: #37474F transparent transparent transparent;
  }

  ol li:nth-child(even) div {
    top: calc(100% + 16px);
  }

  ol li:nth-child(even) div::before {
    top: -8px;
    border-width: 8px 0 0 8px;
    border-color: transparent transparent transparent #37474F;
  }
`

const Arrows = styled.div`
`

const Arrow = styled.button`
  ${(props) => props.prev && css`
  `}

  ${(props) => props.next && css`
  `}

  ${(props) => props.disabled && css`
  `}
`

const TimeLine = ({ timestamps }) => {
return (
      <Timeline>
        <ol>
          {timestamps.map((time, index) => (
            <li key={index}>
            <div>
              <time>{time.time}</time>
              <br/><p>{time.description}</p>
            </div>
            </li>
          ))}
        </ol>

        {/*<Arrows>
          <Arrow prev disabled>
            <img src="arrowPrev.svg" alt="prev arrow"/>
          </Arrow>
          <Arrow>
            <img src="arrowNext.svg" alt="next arrow"/>
          </Arrow>
        </Arrows>*/}
      </Timeline>
  )
}

export default TimeLine