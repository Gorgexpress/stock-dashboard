import { CustomCellRendererProps } from "ag-grid-react";
import StockPrice from "./stock-price.interface";

export interface WatchTableRemoveButtonProps extends CustomCellRendererProps<StockPrice> {
    onClick: Function;
}
export default function WatchTableRemoveButton(props: WatchTableRemoveButtonProps) {
    return (
      <button onClick={() => props.onClick(props)}>X</button>
    );
  };