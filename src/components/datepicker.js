import { DatePicker } from 'antd';
import styled from 'styled-components';

const StyledRangePickerContainer = styled.div`
  @media (max-width: 576px) {
    .ant-picker-panels {
      flex-direction: column !important;
    }
  }
`;

const RangeDatePicker = (props) => {
  return (
    <DatePicker.RangePicker
      panelRender={(panelNode) => <StyledRangePickerContainer>{panelNode}</StyledRangePickerContainer>}
      {...props}
    />
  );
};

export default RangeDatePicker;
