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

import { renderTemplate } from "@fantastic-images/core/dist/fabric/render/render-template";
import { Template } from "@fantastic-images/types/src/Template";
import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";
import equal from "deep-equal";
import { fabric } from "fabric";
import zip from "lodash.zip";
import { getChanges } from "./get-changes";

const hasOwnProperty = (object: any, index: string) =>
  Object.prototype.hasOwnProperty.bind(object, index);

const needsFullRender = ([currentTemplate, newTemplate]: [
  Template,
  Template,
]) =>
  !equal(
    currentTemplate.model.fabricExported.objects.length,
    newTemplate.model.fabricExported.objects.length,
    {
      strict: true,
    },
  ) ||
  !equal(currentTemplate.model.sketch, newTemplate.model.sketch, {
    strict: true,
  }) ||
  !equal(currentTemplate.model.staticImages, newTemplate.model.staticImages, {
    strict: true,
  }) ||
  (zip(
    currentTemplate.model.fabricExported.objects,
    newTemplate.model.fabricExported.objects,
  ) as [any, any]).filter(
    ([{ src: src1 }, { src: src2 }]) =>
      !equal(src1, src2, {
        strict: true,
      }),
  ).length;

export default class SmartRender extends EditorPlugin {
  async forceRender() {
    if (this.editor && this.canvas) {
      const { canvas } = this;
      const { template } = this.editor.state;
      await renderTemplate({ fabric })({
        canvas,
      })(template);
      this.editor.events.emit("ApplySelection");
    }
  }
  async smartRender([currTemplate, newTemplate]: [Template, Template]) {
    if (needsFullRender([currTemplate, newTemplate])) {
      await this.forceRender();
    } else {
      if (this.editor && this.canvas) {
        const { canvas } = this;
        const { template } = this.editor.state;
        const changes = getChanges(canvas, template);
        if (changes.length) {
          canvas.discardActiveObject(new Event("NO_SYNC"));
          changes.forEach(({ canvasItem, changedProperties }) => {
            canvasItem.set(changedProperties);
            ["left", "top"].some((i) => hasOwnProperty(changedProperties, i)) &&
              canvasItem.setCoords();
          });
          this.editor.events.emit("ApplySelection", false);
          canvas.requestRenderAll();
        }
      }
    }
  }
  onRegisterPlugin() {
    return {
      info: {
        name: "Smart Render Plugin",
      },
    };
  }
  onSetup() {
    this.editor?.events.on("CanvasForceRender", () => this.forceRender());
    this.editor?.events.on("CanvasSmartRender", (arg0: any) =>
      this.smartRender(arg0),
    );
    this.editor?.events.on(
      "EditorOnSetTemplate",
      (
        [currTemplate, newTemplate]: [Template, Template],
        {
          render = true,
          forceRender = false,
        }: {
          render?: boolean;
          forceRender?: boolean;
        } = {},
      ) => {
        switch (forceRender ? "forceRender" : render ? "smartRender" : "") {
          case "forceRender":
            return this.forceRender();
          case "smartRender":
            return this.smartRender([currTemplate, newTemplate]);
          default:
            break;
        }
        return;
      },
    );
  }
  async onMount() {}
  async onSetupCanvas() {
    await this.forceRender();
  }
}
