const CompanyType = `
  # A company in our app
  type Company {
    _id: String,
    name: String,
    description: String,
    users: [User]
  }
`;

export default CompanyType;
