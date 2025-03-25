import styled, { keyframes } from 'styled-components'

const dropAnimation = ($topStart, $topEnd) => keyframes`
  0% {
    transform: scale(0.1, 0.1) rotate(45deg);
    top: ${$topStart}px;
    border-top-left-radius: 50%;
  }
  90% {
    top: ${$topEnd - 18}px;
    border-top-left-radius: 0;
  }
  95% {
    border-top-left-radius: 0;
    transform: scale(0.7, 1) rotate(45deg);
  }
  100% {
    top: ${$topEnd}px;
    border-top-left-radius: 50%;
    transform: scale(3, 0.1) rotate(45deg);
  }
`

const Drop = styled.div`
	position: absolute;
	width: 50px;
	height: 50px;
	background: transparent;

	&::after {
		content: '';
		display: block;
		background: #07bdff;
		width: 10px;
		height: 10px;
		position: absolute;
		left: 50%;
		transform: translateX(-50%) scale(0.7, 1) rotate(45deg);
		border-radius: 50%;
		animation: ${({ $topStart, $topEnd }) => dropAnimation($topStart, $topEnd)}
			${({ $duration }) => $duration}s ease infinite;
	}
`
const WaterDrop = ({ topStart, topEnd, duration, left }) => (
	<div style={{ transform: `translateX(${left}px)` }}>
		<Drop $topStart={topStart} $topEnd={topEnd} $duration={duration} />
	</div>
)
export default WaterDrop

