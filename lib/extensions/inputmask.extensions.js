/*
 Input Mask plugin extensions
 http://github.com/RobinHerbots/jquery.inputmask
 Copyright (c) Robin Herbots
 Licensed under the MIT license
 */
var Inputmask = require("../inputmask");
//extra definitions
Inputmask.extendDefinitions({
	"A": {
		validator: "[A-Za-z\u0410-\u044F\u0401\u0451\u00C0-\u00FF\u00B5]",
		casing: "upper" //auto uppercasing
	},
	"&": { //alfanumeric uppercasing
		validator: "[0-9A-Za-z\u0410-\u044F\u0401\u0451\u00C0-\u00FF\u00B5]",
		casing: "upper"
	},
	"#": { //hexadecimal
		validator: "[0-9A-Fa-f]",
		casing: "upper"
	}
});


function ipValidator(chrs, maskset, pos, strict, opts) {
	if (pos - 1 > -1 && maskset.buffer[pos - 1] !== ".") {
		chrs = maskset.buffer[pos - 1] + chrs;
		if (pos - 2 > -1 && maskset.buffer[pos - 2] !== ".") {
			chrs = maskset.buffer[pos - 2] + chrs;
		} else chrs = "0" + chrs;
	} else chrs = "00" + chrs;
	return new RegExp("25[0-5]|2[0-4][0-9]|[01][0-9][0-9]").test(chrs);
}

function cnpjValidator(cnpj) {
	const CNPJ_SIZE = 14;
	const MOD = 11;
	const AR_CNPJ = cnpj.split("").map(val => parseInt(val));
	if (AR_CNPJ.length !== CNPJ_SIZE || AR_CNPJ.filter((val, idx, self) => self.indexOf(val) === idx).length < 2) {
		return false;
	}

	let valid = AR_CNPJ.slice(0, AR_CNPJ.length - 2);
	while (valid.length < CNPJ_SIZE) {
		const SUM = valid.reduce(function(acc, cur, idx, src) {
			return acc + cur * (src.length - 7 - idx < 2 ? src.length - 7 - idx + 8 : src.length - 7 - idx);
		}, 0);

		if (SUM % MOD < 2) {
			valid.push(0);
		} else {
			valid.push(11 - SUM % MOD);
		}
	}

	if (!(JSON.stringify(AR_CNPJ) === JSON.stringify(valid))) {
		return false;
	}

	return true;
}

function cpfValidator(cpf) {
	const CPF_SIZE = 11;
	const AR_CPF = cpf.split("").map(val => parseInt(val));
	if (AR_CPF.length !== CPF_SIZE || AR_CPF.filter((val, idx, self) => self.indexOf(val) === idx).length < 2) {
		return false;
	}

	let valid = AR_CPF.slice(0, AR_CPF.length - 2);
	while (valid.length < CPF_SIZE) {
		const SUM = valid.reduce(function(acc, cur, idx, src) {
			return acc + cur * (src.length + 1 - idx);
		}, 0);

		let mod = SUM % CPF_SIZE;
		if (mod < 2) {
			valid.push(0);
		} else {
			valid.push(CPF_SIZE - mod);
		}
	}

	if (!(JSON.stringify(AR_CPF) === JSON.stringify(valid))) {
		return false;
	}

	return true;
}

Inputmask.extendAliases({
	"cssunit": {
		regex: "[+-]?[0-9]+\\.?([0-9]+)?(px|em|rem|ex|%|in|cm|mm|pt|pc)"
	},
	"url": { //needs update => https://en.wikipedia.org/wiki/URL
		regex: "(https?|ftp)//.*",
		autoUnmask: false
	},
	"ip": { //ip-address mask
		mask: "i[i[i]].j[j[j]].k[k[k]].l[l[l]]",
		definitions: {
			"i": {
				validator: ipValidator
			},
			"j": {
				validator: ipValidator
			},
			"k": {
				validator: ipValidator
			},
			"l": {
				validator: ipValidator
			}
		},
		onUnMask: function (maskedValue, unmaskedValue, opts) {
			return maskedValue;
		},
		inputmode: "numeric",
	},
	"email": {
		//https://en.wikipedia.org/wiki/Domain_name#Domain_name_space
		//https://en.wikipedia.org/wiki/Hostname#Restrictions_on_valid_host_names
		//should be extended with the toplevel domains at the end
		mask: "*{1,64}[.*{1,64}][.*{1,64}][.*{1,63}]@-{1,63}.-{1,63}[.-{1,63}][.-{1,63}]",
		greedy: false,
		casing: "lower",
		onBeforePaste: function (pastedValue, opts) {
			pastedValue = pastedValue.toLowerCase();
			return pastedValue.replace("mailto:", "");
		},
		definitions: {
			"*": {
				validator: "[0-9\uFF11-\uFF19A-Za-z\u0410-\u044F\u0401\u0451\u00C0-\u00FF\u00B5!#$%&'*+/=?^_`{|}~-]"
			},
			"-": {
				validator: "[0-9A-Za-z-]"
			}
		},
		onUnMask: function (maskedValue, unmaskedValue, opts) {
			return maskedValue;
		},
		inputmode: "email"
	},
	"mac": {
		mask: "##:##:##:##:##:##"
	},
	//https://en.wikipedia.org/wiki/Vehicle_identification_number
	// see issue #1199
	"vin": {
		mask: "V{13}9{4}",
		definitions: {
			"V": {
				validator: "[A-HJ-NPR-Za-hj-npr-z\\d]",
				casing: "upper"
			}
		},
		clearIncomplete: true,
		autoUnmask: true
	},
	// https://pt.wikipedia.org/wiki/Cadastro_Nacional_da_Pessoa_Jur%C3%ADdica
	"cnpj": {
		mask: "99.999.999/9999-99",
		clearIncomplete: true,
		autoUnmask: true,
		inputmode: "numeric",
		oncomplete: function (evt) {
			let cnpj = $(evt.target).inputmask("unmaskedvalue");
			if (!cnpjValidator(cnpj)) {
				$(evt.target).val("");
			}
		},
		// https://pt.wikipedia.org/wiki/Cadastro_de_pessoas_f%C3%ADsicas
		"cpf": {
			mask: "999.999.999-99",
			clearIncomplete: true,
			autoUnmask: true,
			inputmode: "numeric",
			oncomplete: function (evt) {
				let cpf = $(evt.target).inputmask("unmaskedValue");
				if (!cpfValidator(cpf)) {
					$(evt.target).val("");
				}
			}
		}
	}
});
module.exports = Inputmask;
