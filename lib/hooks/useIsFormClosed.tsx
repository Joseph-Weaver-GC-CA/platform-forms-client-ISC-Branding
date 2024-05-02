import { useTemplateStore } from "@formbuilder/store";
import { dateHasPast } from "@lib/utils";

export const useIsFormClosed = () => {
  const { closingDate } = useTemplateStore((s) => ({
    closingDate: s.closingDate,
  }));

  let isPastClosingDate = false;

  if (closingDate) {
    isPastClosingDate = dateHasPast(Date.parse(closingDate));
  }

  return isPastClosingDate;
};
