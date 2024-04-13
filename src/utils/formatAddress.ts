const formatAddress = (address: string): string => {
  if (address.length < 8) {
      throw new Error("Address too short to format in this style.");
  }
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
};

export default formatAddress;