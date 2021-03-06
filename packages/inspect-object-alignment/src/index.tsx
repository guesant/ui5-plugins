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

import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";
import * as React from "react";
import { align } from "./modes/align";
import { distribute } from "./modes/distribute";

export default class InspectObjectAlignment extends EditorPlugin {
  onRegisterPlugin() {
    return {
      info: {
        name: "Inspect Object Alignment",
      },
    };
  }
  onSetup() {}
  async onMount() {
    await this.editor?.events.emit("SetInspector", {
      verifyCompatibility: () => true,
      component: () => {
        const Align = align(this);
        const Distribute = distribute(this);
        return (
          <div
            children={
              <div
                style={{
                  paddingTop: 6,
                  paddingBottom: 6,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
                children={[
                  () => React.createElement(Align),
                  () => React.createElement(Distribute),
                ].map((i, idx) =>
                  React.createElement(
                    React.Fragment,
                    { key: idx },
                    React.createElement(i),
                  ),
                )}
              />
            }
          />
        );
      },
    });
  }
}
