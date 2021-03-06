//region Preamble
/**
 * https://github.com/guesant/ui5-monorepo
 * Copyright (C) 2020 Gabriel Rodrigues
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
//endregion

import * as React from "react";
import InspectObjectAlignment from "../..";
import { Grid, GridButton } from "../../components/grid";
import { distributeHorizontalCenter } from "./distribute-horizontal-center";
import { distributeHorizonalLeft } from "./distribute-horizontal-left";
import { distributeHorizontalRight } from "./distribute-horizontal-right";
import { distributeVerticalBottom } from "./distribute-vertical-bottom";
import { distributeVerticalCenter } from "./distribute-vertical-center";
import { distributeVerticalTop } from "./distribute-vertical-top";

export const distribute = (plugin: InspectObjectAlignment) => () => {
  if (!plugin.editor) return <div />;
  const modifiers: React.ButtonHTMLAttributes<HTMLButtonElement>[] = [
    distributeHorizonalLeft(plugin),
    distributeHorizontalCenter(plugin),
    distributeHorizontalRight(plugin),
    distributeVerticalTop(plugin),
    distributeVerticalCenter(plugin),
    distributeVerticalBottom(plugin),
  ];
  return (
    <Grid
      children={
        <React.Fragment>
          {modifiers.map(({ ...props }, idx) =>
            React.createElement(
              React.Fragment,
              { key: idx },
              React.createElement(GridButton, { ...props }),
            ),
          )}
        </React.Fragment>
      }
    />
  );
};
