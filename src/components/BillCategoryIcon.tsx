import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { memo } from "react";

import { BillCategoryEnum } from "@/types/BillCategories";

type IBillCategoryIconProps = {
  category: BillCategoryEnum;
  size?: number;
  color?: string;
};

const BillCategoryIcon = memo<IBillCategoryIconProps>(
  ({ category, size = 20, ...props }) => {
    // const styles = useStyles();

    console.log("category", category);
    switch (category) {
      case BillCategoryEnum.Accommodation:
        return <Ionicons name="bed" size={size} {...props} />;
      case BillCategoryEnum.Entertainment:
        return <FontAwesome name="money" size={size} {...props} />;
      case BillCategoryEnum.FoodAndDining:
        return <FontAwesome5 name="coffee" size={size} {...props} />;
      case BillCategoryEnum.Insurance:
        return <Entypo name="text-document" size={size} {...props} />;
      case BillCategoryEnum.Miscellaneous:
        return <FontAwesome5 name="comment-alt" size={size} {...props} />;
      case BillCategoryEnum.Shopping:
        return <Entypo name="shopping-cart" size={size} {...props} />;
      case BillCategoryEnum.SightseeingAndActivities:
        return <Entypo name="flower" size={size} {...props} />;
      case BillCategoryEnum.Transportation:
        return <FontAwesome name="car" size={size} {...props} />;
    }
  }
);

// const useStyles = makeStyles((theme) => ({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
// }));

BillCategoryIcon.displayName = "BillCategoryIcon";

export default BillCategoryIcon;
