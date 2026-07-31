import countriesData from './countries.json'

interface LovItem {
  pyKeyString: string;
  pyActualValue: string;
  pyCategory: string;
  pyRowNumber: string;
  SupportingText?: string;
}

interface CountryItem {
  Name: string;
  ISOCode: string;
}

export const LOV_DATA: LovItem[] = [
        {
            "pyActualValue": "Proof of Purchase",
            "pyCategory": "EvidenceType",
            "pyKeyString": "ProofOfPurchase",
            "pyRowNumber": "1"
        },
        {
            "pyActualValue": "Evidence of Ownership",
            "pyCategory": "EvidenceType",
            "pyKeyString": "EvidenceOfOwnership",
            "pyRowNumber": "2"
        },
        {
            "pyActualValue": "Photograph of Item",
            "pyCategory": "EvidenceType",
            "pyKeyString": "PhotographOfItem",
            "pyRowNumber": "3"
        },
        {
            "pyActualValue": "Photograph of Damaged",
            "pyCategory": "EvidenceType",
            "pyKeyString": "ImageOfDamagedItem",
            "pyRowNumber": "4"
        },
        {
            "pyActualValue": "Repair Estimate or Quote",
            "pyCategory": "EvidenceType",
            "pyKeyString": "RepairEstimateOrQuote",
            "pyRowNumber": "5"
        },
        {
            "pyActualValue": "Repair Invoice",
            "pyCategory": "EvidenceType",
            "pyKeyString": "RepairInvoice",
            "pyRowNumber": "6"
        },
        {
            "pyActualValue": "Police Report or Crime Reference",
            "pyCategory": "EvidenceType",
            "pyKeyString": "PoliceCrimeReferenceReport",
            "pyRowNumber": "7"
        },
        {
            "pyActualValue": "Bank or Card Provider Evidence",
            "pyCategory": "EvidenceType",
            "pyKeyString": "BankCardProviderEvidence",
            "pyRowNumber": "8"
        },
        {
            "pyActualValue": "Incident Report",
            "pyCategory": "EvidenceType",
            "pyKeyString": "IncidentReport",
            "pyRowNumber": "9"
        },
        {
            "pyActualValue": "Military Documentation",
            "pyCategory": "EvidenceType",
            "pyKeyString": "MilitaryDocumentation",
            "pyRowNumber": "10"
        },
        {
            "pyActualValue": "Training or Examination Receipt",
            "pyCategory": "EvidenceType",
            "pyKeyString": "TrainingExaminationReport",
            "pyRowNumber": "11"
        },
        {
            "pyActualValue": "Other Supporting Document",
            "pyCategory": "EvidenceType",
            "pyKeyString": "Other",
            "pyRowNumber": "12"
        },
        {
            "pyActualValue": "False",
            "pyCategory": "GenericTrueFalse",
            "pyKeyString": "false",
            "pyRowNumber": "2"
        },
        {
            "pyActualValue": "True",
            "pyCategory": "GenericTrueFalse",
            "pyKeyString": "true",
            "pyRowNumber": "1"
        },
        {
            "pyActualValue": "No",
            "pyCategory": "GenericYesNo",
            "pyKeyString": "No",
            "pyRowNumber": "2"
        },
        {
            "pyActualValue": "Yes",
            "pyCategory": "GenericYesNo",
            "pyKeyString": "Yes",
            "pyRowNumber": "1"
        },
        {
            "pyActualValue": "Military Kit",
            "pyCategory": "ItemType",
            "pyKeyString": "MK",
            "pyRowNumber": "1"
        },
        {
            "pyActualValue": "Personally Purchased Kit",
            "pyCategory": "ItemType",
            "pyKeyString": "PPK",
            "pyRowNumber": "2"
        },
        {
            "pyActualValue": "Mobile Phone",
            "pyCategory": "ItemType",
            "pyKeyString": "MP",
            "pyRowNumber": "3"
        },
        {
            "pyActualValue": "Jewellery",
            "pyCategory": "ItemType",
            "pyKeyString": "JEW",
            "pyRowNumber": "4"
        },
        {
            "pyActualValue": "Valuables",
            "pyCategory": "ItemType",
            "pyKeyString": "VAL",
            "pyRowNumber": "5"
        },
        {
            "pyActualValue": "Furniture / Household Items",
            "pyCategory": "ItemType",
            "pyKeyString": "FHI",
            "pyRowNumber": "6"
        },
        {
            "pyActualValue": "Bedding & Linen",
            "pyCategory": "ItemType",
            "pyKeyString": "BEL",
            "pyRowNumber": "7"
        },
        {
            "pyActualValue": "Clothing & Uniform",
            "pyCategory": "ItemType",
            "pyKeyString": "CLU",
            "pyRowNumber": "8"
        },
        {
            "pyActualValue": "Footwear",
            "pyCategory": "ItemType",
            "pyKeyString": "FTW",
            "pyRowNumber": "9"
        },
        {
            "pyActualValue": "Sports Equipment",
            "pyCategory": "ItemType",
            "pyKeyString": "SPO",
            "pyRowNumber": "10"
        },
        {
            "pyActualValue": "Cycling Equipment",
            "pyCategory": "ItemType",
            "pyKeyString": "CYC",
            "pyRowNumber": "11"
        },
        {
            "pyActualValue": "Optical Equipment",
            "pyCategory": "ItemType",
            "pyKeyString": "OPE",
            "pyRowNumber": "12"
        },
        {
            "pyActualValue": "Watches",
            "pyCategory": "ItemType",
            "pyKeyString": "WAT",
            "pyRowNumber": "13"
        },
        {
            "pyActualValue": "Bags & Luggage",
            "pyCategory": "ItemType",
            "pyKeyString": "BAL",
            "pyRowNumber": "14"
        },
        {
            "pyActualValue": "Tools & Equipment",
            "pyCategory": "ItemType",
            "pyKeyString": "TOE",
            "pyRowNumber": "15"
        },
        {
            "pyActualValue": "Other",
            "pyCategory": "ItemType",
            "pyKeyString": "OTH",
            "pyRowNumber": "16"
        },
        {

            "pyActualValue": "A different location",
            "pyCategory": "LossLocation",
            "pyKeyString": "DL",
            "pyRowNumber": "3",
            "SupportingText": "Enter an address or describe the location"
        },
        {

            "pyActualValue": "Same as my address",
            "pyCategory": "LossLocation",
            "pyKeyString": "PHA",
            "pyRowNumber": "1",
            "SupportingText": "On base or at your registered address"
        },
        {

            "pyActualValue": "On deployment or exercise",
            "pyCategory": "LossLocation",
            "pyKeyString": "ODE",
            "pyRowNumber": "2",
            "SupportingText": "Overseas or at a different military location"
        },
        {

            "pyActualValue": "Damage",
            "pyCategory": "LossType",
            "pyKeyString": "DA",
            "pyRowNumber": "3"
        },
        {

            "pyActualValue": "Damage to my SFA",
            "pyCategory": "LossType",
            "pyKeyString": "DSFA",
            "pyRowNumber": "7"
        },
        {

            "pyActualValue": "Damage to my SLA",
            "pyCategory": "LossType",
            "pyKeyString": "DSLA",
            "pyRowNumber": "6"
        },
        {

            "pyActualValue": "Fire",
            "pyCategory": "LossType",
            "pyKeyString": "FI",
            "pyRowNumber": "4"
        },
        {

            "pyActualValue": "Loss",
            "pyCategory": "LossType",
            "pyKeyString": "LO",
            "pyRowNumber": "2"
        },
        {

            "pyActualValue": "Other",
            "pyCategory": "LossType",
            "pyKeyString": "OTH",
            "pyRowNumber": "8"
        },
        {

            "pyActualValue": "Theft",
            "pyCategory": "LossType",
            "pyKeyString": "TH",
            "pyRowNumber": "1"
        },
        {

            "pyActualValue": "Water Damage",
            "pyCategory": "LossType",
            "pyKeyString": "WD",
            "pyRowNumber": "5"
        },
        {

            "pyActualValue": "Military Kit Contents and Personal Possessions",
            "pyCategory": "Product",
            "pyKeyString": "MKCPP",
            "pyRowNumber": "1"
        },
        {

            "pyActualValue": "Dependent",
            "pyCategory": "Relationship",
            "pyKeyString": "DP",
            "pyRowNumber": "3"
        },
        {

            "pyActualValue": "Policyholder",
            "pyCategory": "Relationship",
            "pyKeyString": "PH",
            "pyRowNumber": "1"
        },
        {

            "pyActualValue": "Spouse",
            "pyCategory": "Relationship",
            "pyKeyString": "SP",
            "pyRowNumber": "2"
        },
        {

            "pyActualValue": "Authorised Person",
            "pyCategory": "Relationship",
            "pyKeyString": "AP",
            "pyRowNumber": "4"
        },
        {

            "pyActualValue": "Other (if applicable)",
            "pyCategory": "Relationship",
            "pyKeyString": "OTH",
            "pyRowNumber": "5"
        },
        {

            "pyActualValue": "Military Service Uniform, Equipment and Personally Purchased Kit",
            "pyCategory": "ItemCoverType",
            "pyKeyString": "MEP",
            "pyRowNumber": "1"
        },
        {

            "pyActualValue": "Valuables and Personal Possessions",
            "pyCategory": "ItemCoverType",
            "pyKeyString": "VPP",
            "pyRowNumber": "2"
        },
        {

            "pyActualValue": "Contents",
            "pyCategory": "ItemCoverType",
            "pyKeyString": "CON",
            "pyRowNumber": "3"
        },
        {

            "pyActualValue": "Personal Liability",
            "pyCategory": "ItemCoverType",
            "pyKeyString": "PEL",
            "pyRowNumber": "4"
        },
        {

            "pyActualValue": "Money and Credit Card Cover",
            "pyCategory": "ItemCoverType",
            "pyKeyString": "MCCC",
            "pyRowNumber": "5"
        },
        {

            "pyActualValue": "Pedal Cycles",
            "pyCategory": "ItemCoverType",
            "pyKeyString": "PECY",
            "pyRowNumber": "6"
        },
        {

            "pyActualValue": "Licence to Occupy",
            "pyCategory": "ItemCoverType",
            "pyKeyString": "LTO",
            "pyRowNumber": "7"
        }
    ];

export function mockGetDataAsync(
  dataPage: string,
  _context: unknown,
  parameters: Record<string, string>
): Promise<{ data: LovItem[] | CountryItem[] }> {
  if (dataPage === 'D_LOVList') {
    console.log('lov_da',LOV_DATA)
    const category = parameters?.Category ?? '';
    return Promise.resolve({
      data: category? LOV_DATA.filter(item => item.pyCategory === category) : LOV_DATA
    });
  }
  else if(dataPage === 'D_CountryList'){
    return Promise.resolve({
      data: countriesData.data as CountryItem[]
    });
  }
  return Promise.resolve({ data: [] });
}

// Enabled + a sample content ID so the OneTrust consent banner is exercised in Storybook.
export function mockGetPageDataAsync(dataPage: string): Promise<Record<string, unknown>> {
  if (dataPage === 'D_EnvironmentConfig') {
    return Promise.resolve({
      pyContentID: '019fa4b0-c665-7157-a9be-7c7a75abe3d2',
      pyEnableNotifications: true
    });
  }
  return Promise.resolve({});
}
