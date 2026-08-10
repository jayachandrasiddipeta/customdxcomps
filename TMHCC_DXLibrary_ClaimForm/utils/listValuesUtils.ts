export interface ListOption {
  key: string;
  label: string;
  /** Optional secondary description shown under the label, e.g. for card-style radio options. */
  subtitle?: string;
}

/** Country LOV option (ISO code + name). */
export type CountryOption = ListOption;

export const LIST_CATEGORIES = {
  PRODUCT: 'Product',
  RELATIONSHIP: 'Relationship',
  LOSS_TYPE: 'LossType',
  LOSS_LOCATION: 'LossLocation',
  GENERIC_YES_NO: 'GenericYesNo',
  ITEM_TYPE: 'ItemType',
  ITEM_COVER_TYPE: 'ItemCoverType',
  EVIDENCE_TYPE: 'EvidenceType'
} as const;


export interface ListValuesFetchResult<T> {
  data: T;
  failed: boolean;
}

export async function fetchAllListValues(dataPageName: string): Promise<ListValuesFetchResult<Record<string, ListOption[]>>> {
    try {
    const context = '';
    const parameters = {};
    const paging = {
      pageNumber: 1,
      pageSize: 500,
    };
    const listValuesQuery = {
      select: [
        { field: "pyKeyString" },
        { field: "pyActualValue" },
        { field: "pyCategory" },
        { field: "pyRowNumber"},
        { field: "SupportingText"}
      ],
      useExtendedTimeout: false,
    };
    const response = await (window as any).PCore.getDataPageUtils().getDataAsync(
      dataPageName,
      context,
      parameters,
      paging,
      listValuesQuery,
    );

    const grouped: Record<string, ListOption[]> = {};
    const items = (response?.data??[]) as Record<string, string>[];
    items.sort((a,b) => Number(a.pyRowNumber ?? 0) - Number(b.pyRowNumber ?? 0));
    for(const item of items){
      const cat = item.pyCategory ?? ''
      if(!grouped[cat]) grouped[cat] = [];
      grouped[cat].push({
        key: item.pyKeyString ?? '',
        label: item.pyActualValue ?? '',
        subtitle: item.SupportingText || undefined
      });
    }
    return { data: grouped, failed: false };
  }
  catch{
    return { data: {}, failed: true };
  }
}

export async function fetchCountryList(dataPageName: string): Promise<ListValuesFetchResult<CountryOption[]>> {
  try {
    const context = '';
    const parameters = {};
    const paging = {
      pageNumber: 1,
      pageSize: 500,
    };
    const countryListQuery = {
      select: [
        { field: "Name" },
        { field: "ISOCode" }
      ],
      useExtendedTimeout: false,
    };
    const response = await (
      window as any
    ).PCore.getDataPageUtils().getDataAsync(
      dataPageName,
      context,
      parameters,
      paging,
      countryListQuery,
    );
    const data = (response?.data ?? []).map((item: Record<string, string>) => ({
      key: item.ISOCode ?? '',
      label: item.Name ?? ''
    }));
    return { data, failed: false };
  } catch {
    return { data: [], failed: true };
  }
}
