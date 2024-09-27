import { CustomCellRendererProps } from "ag-grid-react";
import StockPrice from "./stock-price.interface";

export interface SymbolRemoveButtonProps extends CustomCellRendererProps<StockPrice> {
    onClick: Function;
}
export default function SymbolRemoveButton(props: SymbolRemoveButtonProps) {
    return (
      <button onClick={() => props.onClick(props)}>X</button>
    );
  };