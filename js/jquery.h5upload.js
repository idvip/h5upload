/*
    h5上传图片带预览功能控件
    时间：2016年6月6日
    版本：1.0
*/
(function (jq) {
    //opt:配置 
    //  name = input表单名称(默认uploadfile)
    //  exts = 允许的后缀名(array,默认4种图片格式) 
    //  max = 最大上传数量(默认3)
    //  size = 文件最大大小(字节,默认3M)
    //  del = 移除图片时是否提示(默认提示)
    //msg:消息内容，配置项与opt项同
    jq.fn.h5upload = function (opt, msg) {
        opt = jq.extend({ exts: ['jpg', 'gif', 'png', 'jpeg'], max: 3, size: 3145728, del: true, name: 'uploadfile' }, opt);
        msg = jq.extend({ exts: "文件格式不合法！", max: "最多允许上传" + opt.max + "张", size: "文件大小不得超过" + (opt.size / 1024) + "kb", del: "是否移除此图像？" }, msg);
        var $self = $(this);
        var $plus = null;
        var curFileCount = 0;
        function onadd() {
            $self.find("input[name=" + opt.name+ "]:last").click();
        }
        function addEvent($input) {
            $input.change(function () {
                var file = this.files[0];
                if (checkFile(file)) {
                    var r = new FileReader();
                    r.readAsDataURL(file);
                    r.onload = function () {
                        $imgdiv = $("<div class='h5upload_item h5upload_img' style='background-image:url(" + this.result + ")'></div>");
                        $imgclose = $("<img class='h5upload_delimg' src='"+closeimg+"'/>");
                        //保存关联对象到dom，以便删除使用
                        $imgclose[0].link = [$input, $imgdiv];
                        $imgclose.click(function () {
                            removefile(this);
                        });
                        $plus.before($imgdiv.append($imgclose));
                        newfile();
                    }
                }
            });
        }
        function addInput($parent) {
            return $("<input type='file' name='" + opt.name + "' style='display:none'/>").appendTo($parent);
        }
        function newfile() {
            curFileCount++;
            if (curFileCount > opt.max) {
                $plus.hide();
            }
            $input = addInput($self);
            addEvent($input);
        }
        function removefile(base) {
            if (!opt.del || confirm(msg.del)) {
                base.link[0].remove();
                base.link[1].remove();
                curFileCount--;
                if (curFileCount <= opt.max) {
                    $plus.show();
                }
            }
        }
        function init() {
            $plus = $("<img src='"+plusimg+"' class='h5upload_item'/>");
            $self.append($plus).append("<div class='h5upload_clear'></div>");
            $plus.click(onadd);
            return $plus;
        }
        function checkFile(file) {
            //后缀名检测
            var sps = file.name.split(".");
            if (sps.length < 2) return falsemsg('exts');
            if (opt.exts.indexOf(sps[1].toLowerCase()) < 0) return falsemsg('exts');
            //大小检测
            if (file.size > opt.size) return falsemsg("size");
            return true;
        }
        function falsemsg(key) {
            if (msg[key]) alert(msg[key]); return false;
        }
        $plus = init();
        newfile();
    }
    var plusimg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKEAAAChCAYAAACvUd+2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTRBQzkwRTMyQkIxMTFFNkFEMUNCQUQyQzgwRDk0QkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTRBQzkwRTQyQkIxMTFFNkFEMUNCQUQyQzgwRDk0QkUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NEFDOTBFMTJCQjExMUU2QUQxQ0JBRDJDODBEOTRCRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1NEFDOTBFMjJCQjExMUU2QUQxQ0JBRDJDODBEOTRCRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvFhRYoAAALtSURBVHja7NxPSuNQHMDxGLProOIBxPXAiAvBG3gDr+HKY3gDZ+sluutScGBQcC1uXPoHu1T8paRMKEGlY/Js+vnAE3yKlfBo8m36ujIajdazLDuI8RhjGGP6/ZR5823Nn8fYL+LLVozTGL9rv3xY++Vb8+Zbmr+LcbISz4TlIjyKcZxBt37FOMurFWkBkkzecK6GrkyuF/PqmvDE8SCByVm4cBxIqDwL7+eOAwlNzsJ59u91HEgWJuoYdYw6VseoY9QxqGOEiTpGHaOO1THqGHUM6hhhoo5Rx6hjdYw6Rh2DOkaYqGPUMepYHaOOUcegjhEm6hh1jDpWx6hj1DGoY4SJOkYdo47VMeoYdQzqGGGijlHHqGN1jDpGHYM6ZrkV6nh+g8Hg3Z+Px2MH6ZOLcHJe9mw4t9UYuzNzf2O8ODSfq+OiVsc7jslcfsS4mJnbqA4w6hh1DOqYReDeMd9iEbp3TNI6du8YdYw6VseoY1DHqGPUsTpGHaOO1THqGNQx6hh1rI5Rx6hjdYw6BnVMcr3dd/zRxvS+/A8LvsF+KfYdlxvT11p+jKa/v1GdZdr0lC3+BvulqOOfMS4TPO5NB49RPmlcqWNQx6hjUMcfuo6x2UGYzF4Dblfh0HaYLLqlqOOyHu9bfozXhrmHzKdyqeMuXj/zIZnqGHUM6pgeLULvrCZpHXtnNeoYdayOUcegjlHHqGN1jDpGHatj1DGoY9Qx6lgdo45Rx+oYdQzqGHWMOu77vuMuPMfYa5hDHXem3GD/x2GYv44twv9gc7s6Rh2DOqYndezeMeoYdezeMeoY1DHqGHWsjlHHqGN1jDoGdYw6Rh2rY9Qx6lgdo45BHaOOUcfqGHWMOlbHqGNQx6hj1LE6Rh2jjtUx6hjUMeoYdayOUceoY3WMOgZ1jDpGHatj1DHqWB2jjkEdo45Rx+oYdYw6VseoYyiqRXge47B+sdgQLObNf/X81nQRrtcW4PRicWjefEfzwzcBBgDg09XAfXKEpgAAAABJRU5ErkJggg==";
    var closeimg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAoCAYAAAB99ePgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjE3REY3RjMyQkIxMTFFNkE1MDI4NEI1NzcwQzlDRDMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjE3REY3RjQyQkIxMTFFNkE1MDI4NEI1NzcwQzlDRDMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MTdERjdGMTJCQjExMUU2QTUwMjg0QjU3NzBDOUNEMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2MTdERjdGMjJCQjExMUU2QTUwMjg0QjU3NzBDOUNEMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjGNPJwAAANYSURBVHjazJhdSBRRFMfPWltsYYUVhYtrtVlK9PGghG2lBQVGUO1DX6RRUJB9SKGR75XiRi8bIkoo1kNsVFSwUAtKD26f4IOBYC8V2xZkZZHYB338z3ontnHXmTszu+sffjDo3Jn/nnvm3nOPzVNaShbJDqaDIaseONnguAJQAdaCZcANpsb9/yMYAL2gG9wHn2VfYpOI3BSwDxwBxZLvGQF3wUXwWO+gLJ337RKRuGzAGMsBdoJHIAiWWGFurnjYNZBvUSpxOvSBWp45o+ZWiZypIOvFKeIDN0VUpcytBw+Ak1Kr7eAemKHX3HJwJ9mAFGgduCWiOa65WeA2mEnp1UZwQctcM1hImdFxsDWZuc1gD2VWfjBNbY4/6SbKvBaAo2pzvFys1L13FRRQKu4VOqVshYq5Q3pHNvl81NzSQsUlJZr38j18L4+R0Hwl9ya58vJ4yWjja61RlVVVtMPrJbvdTmXl5dTf30/RaDSpsYbGRnI4HJTnclFOTg6Fw2GZgiTAkStLtMYk0pXOTgr39IxulngpvzxRBOONsSKRCHW0t8tEbwMHiyN3QJQ+uhQKhaiwsDAWjUQRTGTsWHU1DQ4OyhYK19ncCVwslRmZzGCu02mFMUXdXM/1ik1eWpzoazye0YJtZOTfdFtgjFXLOZdtdPTpurr/ctBCY6zsLBOlekyBQGDM39paW80ai32xbO6L0dFK8qt1pr5e1zqooa9s7p0ZY/FTqWeZkdBbNvfCCmOcY+ocNGlwgJeSebjYZtaYkmNa66BO/eA9liPXZZWxZF+xgQg+AcNs7hV4JhtzreVCbbCoqEjm8TeUjV85DW3RGsFTw1O0yO2mkzU1msuFMsXBYDC2L0tM6UGOnHLi5x7HSzBnAhScXCEdjq/nhkHDBDD2DZxPdIbwi5N4JnVOzOAYcz/BfuE+E3qoPseoj4a9oov0J83GImC3+BjGPfF38PaYRmOfxErxWm+vhMPLRejvFBt7I/oyfbJdJr/4Re9TZKxb9PqeG+3PcQdoBbhqYR4OidbDJq2KSE9nkx9QCVaLbtAvg6a4T3wWLAaX9DxHpgp+CrwgF+wVvRVPfG8jSU51iZYa94S/y/wam8lWPx/E8wWzRc+F18kPNNpDNlWr/xVgALvfImn4ZGm9AAAAAElFTkSuQmCC";
    var style = ".h5upload_item{float:left;width:60px;height:60px;margin:5px}.h5upload_clear{clear:both}.h5upload_img{background-size:cover;position:relative}.h5upload_delimg{position:absolute;top:-5px;right:-5px;width:18px;height:18px}";
    //输出style到页面
    document.write("<style>"+style+"</style>")
})(jQuery);