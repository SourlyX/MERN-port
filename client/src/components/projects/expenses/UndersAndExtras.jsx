import styled from "styled-components"

const IncomeContainer = styled.div`
  width: 95%;
  max-width: 800px;
  margin: 10px 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`

const QS = styled.p`
  width:45%;
`

const Input = styled.input`
  width: 45%;
  max-width: 150px;
  border-radius: 10px;
`

const UndersAndExtras = ({VTO, setVTO, OT, setOT }) => {
  return(
    <div style={{ display: "flex", flexDirection: "row", width: "100%", margin: "15px 0 0 0" }}>
      <IncomeContainer style={{ maxWidth: "50%" }}>
        <QS>Did you take unpaid days/hours? (in minutes)</QS>
        <Input
          type="number"
          min="0"
          max="100"
          placeholder="VTO"
          value={VTO}
          onChange={(e) => setVTO(e.target.value)}
        />
        </IncomeContainer>
        <IncomeContainer style={{ maxWidth: "50%" }}>
          <QS>Did you work overtime? (minutes)</QS>
            <Input
              type="number"
              min="0"
              max="100"
              placeholder="OT"
              value={OT}
              onChange={(e) => setOT(e.target.value)}
            />
      </IncomeContainer>
    </div>
  )
}

export default UndersAndExtras