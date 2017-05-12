//
//
//PROCEED WITH CAUTION: TIER 9 SHIT CODE
//
//


$(document).ready(function() {

	const DEFAULT_AUTHOR = "my.name";
	const DEFAULT_CLASS = "ClassName";
	const DEFAULT_OBJ = "obj";
	const DEFAULT_EXIT_CMD = "SAIR";

    var cases = 1;

    var messagesList = [];

    var caseHTML =
        '	<div class="case" id="case_1">\
				<div class="input-wrapper">\
				<label>Comando</label>\
				<input type="text" class="command" placeholder="CE" value = {{command}}>\
				</div>\
				<div class="input-wrapper">\
				<label>Constante</label>\
				<input type="text" class="const" value="{{constant}}">\
				</div>\
				<div class="input-wrapper">\
				<label>Nome da função</label>\
				<input type="text" class="function" placeholder="ex: calcExpression" value="{{func}}">\
				</div>\
				<p>Precisa de:</p>\
				<div class="dependencies input-wrapper">\
				<label for="scanner_1">Scanner</label>\
				<input type="checkbox" id="scanner_1" class="check_scanner" checked>\
				<label for="obj_1">Objeto (ex:calc)</label>\
				<input type="checkbox" class="check_obj" id="obj_1" checked>\
				</div>\
				<p class="btn remove-btn">Remover</p>\
			</div>';
    var baseJava = 'import java.util.Scanner;\n \
	/**\n \
	* @author {{author}} \n \
	 * \n \
	 */ \n \
public class Main {\
	\
	{{constants}}\
	private static final String BYE_MSG = "Adeus!";\
	private static final String UNKNOWN_COMMAND = "Comando desconhecido.";\n\n \
	\
	{{functions}}\
	private static String getCommand(Scanner in){\
		return in.nextLine().toUpperCase().trim();\
	}\
	private static void unknownCommand(){\
		System.out.println(UNKNOWN_COMMAND);\
	}\
	\
	private static void useCommand(String command,Scanner in,{{class}} {{obj}}){\
		switch(command){\
			{{cases}}\
			default:\
				unknownCommand();\
				break;\
		}\
		\
	}\
	\
	public static void main(String[] args) {\
		{{class}} {{obj}} = new {{class}}();\
		Scanner in = new Scanner(System.in);\
		\
		String command = getCommand(in);\
		while(!command.equalsIgnoreCase({{exitCmd}})){\
			useCommand(command, in, {{obj}});\
			command = getCommand(in);\
		}\
		\
		System.out.println(BYE_MSG);\
		\
	}\
}\
';

    function getCaseHTML(i) {
        return caseHTML.replace(/_1/g, "_" + i);
    }

    function addCase(command,constant,func,ignoreAnimation) {
    	cases ++;

    	var command = command || "";
    	var func = func || "";
    	var constant = constant || "COMMAND_"+cases;

    	if(typeof command=="object") command = "";

    	var html = getCaseHTML(cases);

    	var html = replaceSection(html,"command",command);
    	var html = replaceSection(html,"constant",constant);
    	var html = replaceSection(html,"func",func);

        $("#switch-menu").append(html);
        //document.getElementById("switch-menu").innerHTML+=getCaseHTML(++cases);
        if(!ignoreAnimation){
        	jumpTo("#case_" + cases)
    	}
        $("#case_" + cases + " .command").first().focus();
    }


    $("#add-case").click(addCase);

    $("#switch-menu").on("click", ".remove-btn", function() {
        //cases--;
        $(this).parent().remove();
    });

    function replaceSection(original, section, content) {
        var newTxt = original.replace(new RegExp('{{' + section + '}}', 'ig'), content);
        return newTxt;
    }

    function jumpTo(elem) {
        $('html, body').animate({
            scrollTop: $(elem).offset().top
        }, 800);
    }

    function createConstant(cons,cmd){
        return "private static final String " + cons + " = \"" + cmd + "\"; \n";
    }

    function generateMenu() {
        var info = getInfo();
        var javaTxt = baseJava;
        var author = info.author || DEFAULT_AUTHOR;
        var className = info.class || DEFAULT_CLASS;
        var objName = info.obj || DEFAULT_OBJ;
        var exit = info.exit || DEFAULT_EXIT_CMD;

        javaTxt = replaceSection(javaTxt, 'author', author);
        javaTxt = replaceSection(javaTxt, 'class', className);
        javaTxt = replaceSection(javaTxt, 'obj', objName);
        javaTxt = replaceSection(javaTxt, 'exitCMD', exit);

        var constants = "";

        for(var i=0;i<messagesList.length;i++){
            var msg = messagesList[i];

            cons = msg.replace(/(\ |\s| | )+/g,"_");
            cons = cons.toUpperCase().replace(/[^a-z|_]/ig,"");
            cons = cons.replace(/_/g," ").trim().replace(/\s/g,"_");
            
            constants+=createConstant(cons,msg);
        }

        constants += "\n";

        var functions = "";
        var cases = "";
        for (var i = 0; i < info.cases.length; i++) {
            var currCase = info.cases[i];
            var cons = currCase.constant;
            var cmd = currCase.command;
            var func = currCase.function;
            var scan = currCase.scanner;
            var obj = currCase.obj;
            var comma = (obj && scan ? ",":"");
            constants += createConstant(cons,cmd);
            functions += func != "" ? "\
				private static void " + func + "(" + ((scan ? "Scanner in" : "") + (obj ? (comma + className + " " + objName) : "")) + ") { \n \n \
				}\n\n" : "";
            cases += "case " + cons + ": \n \
				" + (func != "" ? (func + "(" + ((scan ? "in" : "") + (obj ? (comma + objName) : "")) + ");\n	") : "") +
                "break;";
        }
        javaTxt = replaceSection(javaTxt, 'constants', constants);
        javaTxt = replaceSection(javaTxt, 'functions', functions);
        javaTxt = replaceSection(javaTxt, 'cases', cases);

        return javaTxt;
    }

    function getInfo() {
        var obj = {
            author: "abc.abc",
            class: "Class",
            obj: "obj",
            cases: [{
                command: 'CE',
                constant: 'COMM_1',
                function: 'calcExp',
                scanner: false,
                obj: false
            }, ],
            exit: "SAIR"
        }

        obj.author = $("#author").val();
        obj.class = $("#class-name").val();
        obj.obj = $("#obj-name").val();
        obj.cases = [];
        $(".case").each(function(i, elem) {
            var caseObj = {
                command: '',
                constant: '',
                function: '',
                scanner: false,
                obj: false
            }

            caseObj.command = $(this).find('.command').val();
            caseObj.constant = $(this).find('.const').val();
            caseObj.function = $(this).find('.function').val();
            obj.cases.push(caseObj);
            caseObj.scanner = $(this).find('.check_scanner').prop('checked');
            caseObj.obj = $(this).find('.check_obj').prop('checked');
        });

        var exitCMD = $("#exit-cmd").val();
        var isConstant = false;
        for (var i = 0; i < obj.cases.length && !isConstant; i++) {
            if (obj.cases[i].constant == exitCMD) {
                isConstant = true;
            }
        }
        if (!isConstant) {
            exitCMD = '"' + exitCMD + '"';
        }
        obj.exit = exitCMD;

        return obj;

    }

    var downloadBtnHTML = '<p id="download" class="btn">Download ⇩</p>'

    function start() {
        var text = js_beautify(generateMenu())
        document.getElementById('text-area').innerHTML = downloadBtnHTML + text;
        $("#text-area").show();
        //download(text, "Main.class", "text/plain");
    }

    $("body").on("click", "#download", function() {
        var parent = $(this).parent();
        $(this).remove();
        download(parent.html(), 'Main.java', 'text/plain');
        parent.append(downloadBtnHTML);

    })


    $("#create-btn").click(start);

    $(document).keydown(function(e) {
        if (e.keyCode == 81 && e.ctrlKey) {
            addCase();
        }
    });

    function processPDF(text){
    	$("#pdf-status").addClass('hidden');
        messagesList = [];

    	var allKeywords = text.match(/\b(?!\bPOO|IP\b)[A-Z]{2,}\b/g);
    	var keywords = [];
    	for(var i=0;i<allKeywords.length;i++){
    		var curr = allKeywords[i];
    		if(keywords.indexOf(curr)==-1){
    			keywords.push(curr);
    		}
    	}

    	var messagesRgx = text.match(/(\\|“|”|‘|’|")(.*?)(\\|“|”|‘|’|")/g);
    	var messages = [];
    	if(messagesRgx!=null){
      		messagesRgx.map(function(e){
    		    var msg = e.replace(/(\\|“|”|‘|’|")/g,"").trim();
           		if(messagesList.indexOf(msg)==-1) messagesList.push(msg);
       		 });
		}

    	$(".case").remove();
    	keywords.forEach(function(constant){
    		addCase(constant,constant,constant.toLowerCase(),true);
    		//jumpTo("#case_" + cases);
    	});
    }

    document.getElementById('uploader').addEventListener('change', function() {
        var file = this.files[0];
        linkCounter = 0;
        if (!file) {
            return;
        }
        var fileReader = new FileReader();
        fileReader.onload = function(e) {
        	$("#pdf-status").removeClass('hidden');
            readPDFFile(new Uint8Array(e.target.result)).then(processPDF);
        };
        fileReader.readAsArrayBuffer(file);
    });
});
