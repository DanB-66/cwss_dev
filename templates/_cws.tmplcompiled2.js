//(function(){dust.register("cwsProjects",body_0);function body_0(chk,ctx){return chk.write("<article><h3>").reference(ctx.get("projectName"),ctx,"h").write("</h3><dl><dt>Clienttest:</dt><dd>").reference(ctx.get("client"),ctx,"h").write("</dd><dt>Agency:</dt><dd>").reference(ctx.get("agency"),ctx,"h").write("</dd><dt>Project description:</dt><dd>").reference(ctx.get("projectDescription"),ctx,"h").write("</dd><dt>Work undertaken:</dt><dd>").reference(ctx.getPath(false,["extendedInfo","workUndertaken"]),ctx,"h",["s"]).write("</dd>").exists(ctx.getPath(false,["extendedInfo","otherDetails"]),ctx,{"block":body_1},null).exists(ctx.getPath(false,["assets","images"]),ctx,{"block":body_3},null).exists(ctx.getPath(false,["assets","links"]),ctx,{"block":body_5},null).write("</dl></article>");}function body_1(chk,ctx){return chk.write("<dt>Other details:</dt><dd><ol>").section(ctx.getPath(false,["extendedInfo","otherDetails"]),ctx,{"block":body_2},null).write("</ol></dd>");}function body_2(chk,ctx){return chk.write("<li>").reference(ctx.getPath(true,[]),ctx,"h").write("</li>");}function body_3(chk,ctx){return chk.write("<dt>Images:</dt><dd><ul>").section(ctx.getPath(false,["assets","images"]),ctx,{"block":body_4},null).write("</ul></dd>");}function body_4(chk,ctx){return chk.write("<li><img src=\"").reference(ctx.getPath(true,["url"]),ctx,"h").write("\" alt=\"").reference(ctx.getPath(true,["title"]),ctx,"h").write("\"/></li>");}function body_5(chk,ctx){return chk.write("<dt>Links:</dt><dd><ul>").section(ctx.getPath(false,["assets","links"]),ctx,{"block":body_6},null).write("</ul></dd>");}function body_6(chk,ctx){return chk.write("<li><a href=\"").reference(ctx.getPath(true,["url"]),ctx,"h").write("\" title=\"").reference(ctx.getPath(true,["title"]),ctx,"h").write("\">").reference(ctx.getPath(true,["title"]),ctx,"h").write("</a></li>");}return body_0;})();

(function(){dust.register("cwsProjects",body_0);function body_0(chk,ctx){return chk.write("<article> <h3>").reference(ctx.getPath(false,["projects","projectName"]),ctx,"h").write("</h3> <dl> <dt>dyn_").reference(ctx.getPath(false,["uiLabels","client"]),ctx,"h").write(":</dt> <dd>").reference(ctx.getPath(false,["projects","client"]),ctx,"h").write("</dd> <dt>Agency:</dt> <dd>").reference(ctx.getPath(false,["projects","agency"]),ctx,"h").write("</dd> <dt>Project description:</dt> <dd>").reference(ctx.getPath(false,["projects","projectDescription"]),ctx,"h").write("</dd> <dt>Work undertaken:</dt> <dd>").reference(ctx.getPath(false,["projects","extendedInfo","workUndertaken"]),ctx,"h",["s"]).write("</dd> ").exists(ctx.getPath(false,["projects","extendedInfo","otherDetails"]),ctx,{"block":body_1},null).write(" ").exists(ctx.getPath(false,["projects","assets","images"]),ctx,{"block":body_3},null).write(" ").exists(ctx.getPath(false,["projects","assets","links"]),ctx,{"block":body_5},null).write(" </dl> </article>");}function body_1(chk,ctx){return chk.write(" <dt>Other details:</dt> <dd> <ol> ").section(ctx.getPath(false,["projects","extendedInfo","otherDetails"]),ctx,{"block":body_2},null).write(" </ol> </dd> ");}function body_2(chk,ctx){return chk.write(" <li>").reference(ctx.getPath(true,[]),ctx,"h").write("</li> ");}function body_3(chk,ctx){return chk.write(" <dt>Images:</dt> <dd> <ul> ").section(ctx.getPath(false,["projects","assets","images"]),ctx,{"block":body_4},null).write(" </ul> </dd> ");}function body_4(chk,ctx){return chk.write(" <li><img src=\"").reference(ctx.getPath(true,["url"]),ctx,"h").write("\" alt=\"").reference(ctx.getPath(true,["title"]),ctx,"h").write("\"/></li> ");}function body_5(chk,ctx){return chk.write(" <dt>Links:</dt> <dd> <ul> ").section(ctx.getPath(false,["projects","assets","links"]),ctx,{"block":body_6},null).write(" </ul> </dd> ");}function body_6(chk,ctx){return chk.write(" <li><a href=\"").reference(ctx.getPath(true,["url"]),ctx,"h").write("\" title=\"").reference(ctx.getPath(true,["title"]),ctx,"h").write("\">").reference(ctx.getPath(true,["title"]),ctx,"h").write("</a></li> ");}return body_0;})();