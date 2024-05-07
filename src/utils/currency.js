const currency = (props) => {
  return props?.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') || 0;
};

export default currency;
