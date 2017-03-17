//
//
//PROCEED WITH CAUTION: TIER 9 SHIT CODE
//
//


$( document ).ready(function() {
	
	var cases = 1;
    
	var caseHTML = 
		'	<div class="case" id="case_1">\
				<div class="input-wrapper">\
				<label>Comando</label>\
				<input type="text" class="command" placeholder="CE">\
				</div>\
				<div class="input-wrapper">\
				<label>Constante</label>\
				<input type="text" class="const" value="COMMAND_1">\
				</div>\
				<div class="input-wrapper">\
				<label>Nome da função</label>\
				<input type="text" class="function" placeholder="ex: calcExpression">\
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
	var baseJava  = 'import java.util.Scanner;\n \
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
	
	function getCaseHTML (i){
		return caseHTML.replace(/_1/g,"_"+i);
	}
	
	function addCase(){
		$("#switch-menu").append(getCaseHTML(++cases));
		//document.getElementById("switch-menu").innerHTML+=getCaseHTML(++cases);
		jumpTo("#case_"+cases)
		$("#case_"+cases+" .command").first().focus();
	}
	
	
	$("#add-case").click(addCase);
	
	$("#switch-menu").on("click",".remove-btn",function(){
		//cases--;
		$(this).parent().remove();
	});
	
	function replaceSection(original,section,content){
		var newTxt = original.replace( new RegExp('{{'+section+'}}', 'ig'), content);
		return newTxt;
	}
	
	function jumpTo(elem){
	$('html, body').animate({
        scrollTop: $(elem).offset().top
    }, 0);
	}
	

	
	function generateMenu(){
		var info = getInfo();
		var javaTxt = baseJava;
		javaTxt = replaceSection(javaTxt,'author',info.author);
		javaTxt = replaceSection(javaTxt,'class',info.class);
		javaTxt = replaceSection(javaTxt,'obj',info.obj);
		javaTxt = replaceSection(javaTxt,'exitCMD',info.exit);
		javaTxt = replaceSection(javaTxt,'author',info.author);
		var constants = "";
		var functions = "";
		var cases = "";
		for(var i=0;i<info.cases.length;i++){
			var currCase = info.cases[i];
			var cons = currCase.constant;
			var cmd = currCase.command;
			var func = currCase.function;
			var scan = currCase.scanner;
			var obj = currCase.obj;
			constants+="private static final String "+cons+" = \""+cmd+"\"; \n";
			functions += func!="" ? "\
				private static void "+func+"("+((scan ? "Scanner in":"")+(obj ? (", "+info.class+" "+info.obj):""))+") { \n \n \
				}\n\n" : "";
			cases += "case "+cons+": \n \
				"+(func!= "" ? (func+"("+((scan ? "in":"")+(obj ? (", "+info.obj):""))+");\n	") : "")+
			"break;";
		}
		javaTxt = replaceSection(javaTxt,'constants',constants);
		javaTxt = replaceSection(javaTxt,'functions',functions);
		javaTxt = replaceSection(javaTxt,'cases',cases);
		
		return javaTxt;
	}
	
	function getInfo(){
		var obj = {
			author:"abc.abc",
			class:"Class",
			obj:"obj",
			cases:[
				{
					command:'CE',
					constant:'COMM_1',
					function:'calcExp',
					scanner:false,
					obj:false
				},
			],
			exit:"SAIR"
		}
		
		obj.author = $("#author").val();
		obj.class = $("#class-name").val();
		obj.obj = $("#obj-name").val();
		obj.cases = [];
		$(".case").each(function(i,elem){
			var caseObj = {
				command:'',
				constant:'',
				function:'',
				scanner:false,
				obj:false
			}
			
			caseObj.command = $(this).find('.command').val();
			caseObj.constant = $(this).find('.const').val();
			caseObj.function = $(this).find('.function').val();
			obj.cases.push(caseObj);
			caseObj.scanner = $(this).find('.check_scanner').prop('checked');
			caseObj.obj=$(this).find('.check_obj').prop('checked');
		});
		
		var exitCMD = $("#exit-cmd").val();
		var isConstant = false;
		for(var i=0;i<obj.cases.length && !isConstant;i++){
			if(obj.cases[i].constant==exitCMD){
				isConstant = true;
			}
		}
		if(!isConstant){
			exitCMD = '"'+exitCMD+'"';
		}
		obj.exit = exitCMD;
			
		return obj;
		
	}
	
	var downloadBtnHTML = '<p id="download" class="button">Download ⇩</p>'
	
	function start(){
		var text = js_beautify(generateMenu())
		document.getElementById('text-area').innerHTML = downloadBtnHTML + text;
		$("#text-area").show();
		//download(text, "Main.class", "text/plain");
	}
	
	$("body").on("click","#download",function(){
		var parent = $(this).parent();
		$(this).remove();
		download(parent.html(),'Main.class','text/plain');
		parent.append(downloadBtnHTML);
		
	})
	
	
	$("#create-btn").click(start);
	
	$(document).keydown(function(e) {
        if (e.keyCode == 81 && e.ctrlKey) {
            addCase();
        }
    });
	
	
});