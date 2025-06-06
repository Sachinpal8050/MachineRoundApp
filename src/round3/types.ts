type PrimaryDetails = {
  Place: string;
  Salary: string;
};

export type JobPostType = {
  id: string;
  title: string;
  primary_details: PrimaryDetails;
  whatsapp_no: string;
};
