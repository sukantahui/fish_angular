import { Component, OnInit } from '@angular/core';
import {Customer} from '../../models/customer.model';
import {CustomerService} from '../../services/customer.service';
// import {FormGroup} from "@angular/forms";
import {FormControl, FormGroup} from '@angular/forms';
import {OrderService} from '../../services/order.service';
import {Agent} from '../../models/agent.model';
import {Material} from '../../models/material.model';
import { DatePipe } from '@angular/common';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product.model';
import {StorageMap} from '@ngx-pwa/local-storage';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SncakBarComponent} from '../../common/sncak-bar/sncak-bar.component';
import {OrderDetail} from '../../models/orderDetail.model';
import {OrderMaster} from '../../models/orderMaster.model';
import {Observable} from 'rxjs';
import {ConfirmationDialogService} from '../../common/confirmation-dialog/confirmation-dialog.service';
import {map, startWith} from 'rxjs/operators';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})

export class OrderComponent implements OnInit {
  modelNumberControl = new FormControl();
  // tslint:disable-next-line:max-line-length
  // need to get from API
  options: string[] = ['B7001', 'B7002', 'B7003', 'B7004', 'B7008', 'B7009', 'B7013', 'B7014', 'B7018', 'B7021', 'B7022', 'B7023', 'B7024', 'B7025', 'B7026', 'B7027', 'B7032', 'B7035', 'B7042', 'B7043', 'B7044', 'B7050', 'B7052', 'B7054', 'B7059', 'B7060', 'B7061', 'B7062', 'B7066', 'B7068', 'B7069', 'B7079', 'B7088', 'B7096', 'B7097', 'B7098', 'B7099', 'B7100', 'B7112', 'B7115', 'B7116', 'B7117', 'B7222', 'B7333', 'C0001', 'C0002', 'C0003', 'C0004', 'C0005', 'C0006', 'C0007', 'C0008', 'C0009', 'C0010', 'C0011', 'C0012', 'C0013', 'C0014', 'C0015', 'C0016', 'C0017', 'C0018', 'C0019', 'C0020', 'C0022', 'C0023', 'C0024', 'C0025', 'C0026', 'C0027', 'C0028', 'C0029', 'C0030', 'C0031', 'C0032', 'C0033', 'C0034', 'C0035', 'C0036', 'C0037', 'C0038', 'C0039', 'C0040', 'C0041', 'C0042', 'C0043', 'C0044', 'C0045', 'C0046', 'C0047', 'C0048', 'C0049', 'C0050', 'C0051', 'C0052', 'C0053', 'C0054', 'C0055', 'C0056', 'C0057', 'C0058', 'C0059', 'C0060', 'C0061', 'C0062', 'C0063', 'C0064', 'C0065', 'C0066', 'C0067', 'C0068', 'C0069', 'C0070', 'C0072', 'C0073', 'C0074', 'C0075', 'C0076', 'C0077', 'C0078', 'C0079', 'C0080', 'C0081', 'C0082', 'C0083', 'C0084', 'C0085', 'C0086', 'C0087', 'C0088', 'C0089', 'C0090', 'C0091', 'C0092', 'C0093', 'C0094', 'C0095', 'C0096', 'C0097', 'C0098', 'C0099', 'C0100', 'C0101', 'C0102', 'C0103', 'C0104', 'C0105', 'C0106', 'C0107', 'C0108', 'C0109', 'C0110', 'C0111', 'C0112', 'C0113', 'C0114', 'C0115', 'C0116', 'C0117', 'C0118', 'C0119', 'C0120', 'C0121', 'C0122', 'C0123', 'C0124', 'C0125', 'C0126', 'C0127', 'C0128', 'C0129', 'C0130', 'C0131', 'C0132', 'C0133', 'C0134', 'C0135', 'C0136', 'C0137', 'C0138', 'C0139', 'C0140', 'C0142', 'C0143', 'C0144', 'C0145', 'C0146', 'C0147', 'C0148', 'C0149', 'C0150', 'C0151', 'C0152', 'C0153', 'C0154', 'C0155', 'C0156', 'C0157', 'C0158', 'C0159', 'C0160', 'C0161', 'C0162', 'C0163', 'C0164', 'C0165', 'C0166', 'C0167', 'C0168', 'C0169', 'C0170', 'C0171', 'C0172', 'C0173', 'C0174', 'C0175', 'C0176', 'C0177', 'C0178', 'C0179', 'C0180', 'C0181', 'C0182', 'C0183', 'C0184', 'C0185', 'C0186', 'C0187', 'C0188', 'C0189', 'C0190', 'C0191', 'C0192', 'C0193', 'C0194', 'C0195', 'C0196', 'C0197', 'C0200', 'C0201', 'C0202', 'C0203', 'C0204', 'C0205', 'C0206', 'C0207', 'C0208', 'C0209', 'C0210', 'C0211', 'C0212', 'C0213', 'C0214', 'C0215', 'C0216', 'C0217', 'C0218', 'C0219', 'C0220', 'C0221', 'C0222', 'C0223', 'C0224', 'C0225', 'C0226', 'C0227', 'C0228', 'C0229', 'C0230', 'C0231', 'C0232', 'C0233', 'C0234', 'C0235', 'C0236', 'C0237', 'C0238', 'C0239', 'C0240', 'C0241', 'C0242', 'C0243', 'C0244', 'C0245', 'C0246', 'C0247', 'C0248', 'C0249', 'C0250', 'C0251', 'C0252', 'C0253', 'C0254', 'C0255', 'C0256', 'C0257', 'C0258', 'C0259', 'C0260', 'C0262', 'C0267', 'C0268', 'C0269', 'C0270', 'C0271', 'C0272', 'C0273', 'C0274', 'C0275', 'C0276', 'C0277', 'C0278', 'C0279', 'C0280', 'C0287', 'C0288', 'C0289', 'C0290', 'C0291', 'C0292', 'C0293', 'C0296', 'C0297', 'C0298', 'C0299', 'C0301', 'C0302', 'C0303', 'C0304', 'C0305', 'C0306', 'C0307', 'C0308', 'C0309', 'C0310', 'C0311', 'C0312', 'C0313', 'C0314', 'C0315', 'C0316', 'C0317', 'C0318', 'C0319', 'C0320', 'C0321', 'C0322', 'C0323', 'C0324', 'C0325', 'C0326', 'C0327', 'C0328', 'C0329', 'C0330', 'C0331', 'C0332', 'C0333', 'C0334', 'C0335', 'C0336', 'C0337', 'C0338', 'C0339', 'C0340', 'C0341', 'C0342', 'C0343', 'C0344', 'C0345', 'C0346', 'C0347', 'C0348', 'C0349', 'C0350', 'C0351', 'C0352', 'C0353', 'C0354', 'C0355', 'C0356', 'C0357', 'C0358', 'C0359', 'C0360', 'C0363', 'C0365', 'C0368', 'C0369', 'C0370', 'C0371', 'C0372', 'C0373', 'C0374', 'C0375', 'C0376', 'C0377', 'C0378', 'C0379', 'C0380', 'C0381', 'C0382', 'C0383', 'C0384', 'C0385', 'C0387', 'C0388', 'C0389', 'C0390', 'C0391', 'C0392', 'C0393', 'C0394', 'C0395', 'C0396', 'C0397', 'C0398', 'C0399', 'C0400', 'C0401', 'C0402', 'C0403', 'C0404', 'C0405', 'C0406', 'C0407', 'C0408', 'C0409', 'C0410', 'C0411', 'C0412', 'C0413', 'C0414', 'C0415', 'C0416', 'C0417', 'C0418', 'C0419', 'C0420', 'C0428', 'C0430', 'C0431', 'C0432', 'C0433', 'C0434', 'C0435', 'C0436', 'C0437', 'C0438', 'C0439', 'C0440', 'C0441', 'C0442', 'C0443', 'C0444', 'C0445', 'C0446', 'C0447', 'C0448', 'C0449', 'C0450', 'C0451', 'C0452', 'C0453', 'C0454', 'C0455', 'C0457', 'C0458', 'C0459', 'C0460', 'C0461', 'C0463', 'C0465', 'C0466', 'C0468', 'C0469', 'C0470', 'C0471', 'C0472', 'C0473', 'C0474', 'C0475', 'C0476', 'C0477', 'C0478', 'C0479', 'C0480', 'C0481', 'C0482', 'C0483', 'C0484', 'C0485', 'C0486', 'C0489', 'C0490', 'C0491', 'C0492', 'C0493', 'C0494', 'C0495', 'C0501', 'C0502', 'C0503', 'C0504', 'C0505', 'C0506', 'C0507', 'C0508', 'C0509', 'C0510', 'C0511', 'C0512', 'C0513', 'C0514', 'C0515', 'C0516', 'C0517', 'C0518', 'C0519', 'C0520', 'C0521', 'C0522', 'C0523', 'C0524', 'C0525', 'C0526', 'C0527', 'C0528', 'C0529', 'C0530', 'C0531', 'C0532', 'C0533', 'C0534', 'C0535', 'C0536', 'C0537', 'C0538', 'C0539', 'C0540', 'C0541', 'C0542', 'C0544', 'C0545', 'C0546', 'C0547', 'C0548', 'C0549', 'C0550', 'C0551', 'C0552', 'C0553', 'C0554', 'C0555', 'C0556', 'C0557', 'C0558', 'C0559', 'C0560', 'C0561', 'C0562', 'C0563', 'C0564', 'C0565', 'C0566', 'C0567', 'C0568', 'C0569', 'C0570', 'C0572', 'C0573', 'C0574', 'C0575', 'C0576', 'C0577', 'C0578', 'C0579', 'C0580', 'C0581', 'C0582', 'C0583', 'C0584', 'C0585', 'C0586', 'C0587', 'C0588', 'C0589', 'C0590', 'C0601', 'C0602', 'C0603', 'C0604', 'C0605', 'C0606', 'C0607', 'C0608', 'C0609', 'C0610', 'C0611', 'C0612', 'C0613', 'C0614', 'C0615', 'C0616', 'C0617', 'C0618', 'C0619', 'C0620', 'C0621', 'C0622', 'C0623', 'C0624', 'C0625', 'C0626', 'C0627', 'C0628', 'C0629', 'C0630', 'C0631', 'C0632', 'C0633', 'C0634', 'C0635', 'C0636', 'C0637', 'C0638', 'C0639', 'C0640', 'C0641', 'C0642', 'C0643', 'C0644', 'C0645', 'C0647', 'C0648', 'C0649', 'C0650', 'C0651', 'C0652', 'C0653', 'C0654', 'C0655', 'C0657', 'C0658', 'C0659', 'C0660', 'C0661', 'C0662', 'C0663', 'C0665', 'C0666', 'C0667', 'C0668', 'C0669', 'C0670', 'C0671', 'C0672', 'C0673', 'C0674', 'C0675', 'C0676', 'C0677', 'C0678', 'C0679', 'C0680', 'C0681', 'C0682', 'C0683', 'C0684', 'C0685', 'C0686', 'C0687', 'C0688', 'C0689', 'C0690', 'C0691', 'C0692', 'C0693', 'C0694', 'C0695', 'C0697', 'C0699', 'C0701', 'C0702', 'C0703', 'C0704', 'C0705', 'C0706', 'C0707', 'C0708', 'C0709', 'C0710', 'C0711', 'C0712', 'C0713', 'C0714', 'C0715', 'C0716', 'C0720', 'C0721', 'C0722', 'C0723', 'C0724', 'C0725', 'C0726', 'C0727', 'C0730', 'C0731', 'C0733', 'C0735', 'C0736', 'C0737', 'C0738', 'C0739', 'C0740', 'C0741', 'C0742', 'C0743', 'C0744', 'C0745', 'C0746', 'C0747', 'C0748', 'C0749', 'C0750', 'C0751', 'C0753', 'C0755', 'C0756', 'C0757', 'C0758', 'C0759', 'C0760', 'C0761', 'C0763', 'C0764', 'C0765', 'C0766', 'C0767', 'C0768', 'C0769', 'C0770', 'C0771', 'C0772', 'C0773', 'C0774', 'C0775', 'C0777', 'C0778', 'C0779', 'C0780', 'C0781', 'C0782', 'C0783', 'C0784', 'C0785', 'C0786', 'C0787', 'C0788', 'C0789', 'C0790', 'C0791', 'C0792', 'C0793', 'C0794', 'C0795', 'C0797', 'C0799', 'C0800', 'C0805', 'C0806', 'C0807', 'C0808', 'C0809', 'C0810', 'C0811', 'C0812', 'C0813', 'C0814', 'C0815', 'C0816', 'C0817', 'C0818', 'C0819', 'C0820', 'C0821', 'C0822', 'C0823', 'C0824', 'C0825', 'C0826', 'C0827', 'C0828', 'C0829', 'C0830', 'C0831', 'C0832', 'C0833', 'C0834', 'C0835', 'C0836', 'C0837', 'C0838', 'C0839', 'C0840', 'C0841', 'C0842', 'C0843', 'C0844', 'C0845', 'C0846', 'C0847', 'C0848', 'C0849', 'C0850', 'C0860', 'C0861', 'C0862', 'C0863', 'C0864', 'C0865', 'C0866', 'C0867', 'C0868', 'C0869', 'C0870', 'C0871', 'C0872', 'C0873', 'C0874', 'C0875', 'C0876', 'C0877', 'C0878', 'C0879', 'C0880', 'C0881', 'C0882', 'C0883', 'C0884', 'C0885', 'C0886', 'C0887', 'C0888', 'C0889', 'C0890', 'C0900', 'C0901', 'C0902', 'C0903', 'C0904', 'C0905', 'C0906', 'C0907', 'C0908', 'C0909', 'C0910', 'C0911', 'C0912', 'C0913', 'C0914', 'C0915', 'C0917', 'C0918', 'C0920', 'C0921', 'C0922', 'C0923', 'C0924', 'C0925', 'C0926', 'C0928', 'C0929', 'C0930', 'C0931', 'C0932', 'C0933', 'C0934', 'C0935', 'C0936', 'C0937', 'C0938', 'C0939', 'C0940', 'C0941', 'C0942', 'C0943', 'C0944', 'C0945', 'C0946', 'C0947', 'C0948', 'C0949', 'C0950', 'C0951', 'C0953', 'C0955', 'C0956', 'C0957', 'C0958', 'C0959', 'C0960', 'C0961', 'C0962', 'C0963', 'C0964', 'C0965', 'C0966', 'C0967', 'C0968', 'C0969', 'C0970', 'C0971', 'C0972', 'C0973', 'C0974', 'C0975', 'C0976', 'C0977', 'C0978', 'C0979', 'C0980', 'C0981', 'C0982', 'C0983', 'C0984', 'C0985', 'C0986', 'C0987', 'C0988', 'C0989', 'C0990', 'C0991', 'C0992', 'C0993', 'C0994', 'C0995', 'C0996', 'C0997', 'C0998', 'C0999', 'C1000', 'C1001', 'C1002', 'C1003', 'C1004', 'C1005', 'C1006', 'C1007', 'C1008', 'C1009', 'C1010', 'C1011', 'C1012', 'C1013', 'C1014', 'C1015', 'C1016', 'C1017', 'C1018', 'C1019', 'C1020', 'C1021', 'C1022', 'C1023', 'C1024', 'C1025', 'C1026', 'C1027', 'C1028', 'C1029', 'C1030', 'C1031', 'C1032', 'C1033', 'C1034', 'C1035', 'C1036', 'C1037', 'C1038', 'C1039', 'C1040', 'C1041', 'C1042', 'C1043', 'C1044', 'C1045', 'C1046', 'C1047', 'C1048', 'C1049', 'C1050', 'C1051', 'C1052', 'C1053', 'C1054', 'C1055', 'C1056', 'C1057', 'C1058', 'C1059', 'C1060', 'C1061', 'C1062', 'C1063', 'C1064', 'C1065', 'C1067', 'C1068', 'C1069', 'C1070', 'C1081', 'C1082', 'C1083', 'C1084', 'C1085', 'C1086', 'C1087', 'C1088', 'C1089', 'C1090', 'C1091', 'C1092', 'C1093', 'C1094', 'C1095', 'C1098', 'C1101', 'C1102', 'C1103', 'C1104', 'C1105', 'C1106', 'C1107', 'C1108', 'C1109', 'C1110', 'C1116', 'C1117', 'C1118', 'C1119', 'C1120', 'C1121', 'C1122', 'C1123', 'C1124', 'C1125', 'C1126', 'C1127', 'C1128', 'C1129', 'C1130', 'C1131', 'C1132', 'C1133', 'C1134', 'C1135', 'C1136', 'C1137', 'C1138', 'C1139', 'C1140', 'C1141', 'C1142', 'C1143', 'C1144', 'C1145', 'C1151', 'C1152', 'C1153', 'C1154', 'C1155', 'C1156', 'C1157', 'C1158', 'C1159', 'C1160', 'C1161', 'C1162', 'C1163', 'C1164', 'C1165', 'C1166', 'C1167', 'C1168', 'C1169', 'C1170', 'C1171', 'C1172', 'C1173', 'C1174', 'C1175', 'C1176', 'C1177', 'C1178', 'C1179', 'C1180', 'C1181', 'C1182', 'C1183', 'C1184', 'C1185', 'C1186', 'C1187', 'C1188', 'C1189', 'C1190', 'C1201', 'C1202', 'C1203', 'C1204', 'C1205', 'C1206', 'C1207', 'C1208', 'C1209', 'C1210', 'C1211', 'C1212', 'C1213', 'C1214', 'C1215', 'C1216', 'C1217', 'C1218', 'C1219', 'C1220', 'C1221', 'C1222', 'C1223', 'C1224', 'C1225', 'C1226', 'C1227', 'C1228', 'C1229', 'C1230', 'C1231', 'C1232', 'C1233', 'C1234', 'C1235', 'C1236', 'C1237', 'C1238', 'C1239', 'C1240', 'C1251', 'C1252', 'C1253', 'C1254', 'C1255', 'C1256', 'C1257', 'C1258', 'C1259', 'C1260', 'C1261', 'C1262', 'C1263', 'C1264', 'C1265', 'C1266', 'C1267', 'C1268', 'C1269', 'C1270', 'C1271', 'C1272', 'C1273', 'C1274', 'C1275', 'C1276', 'C1277', 'C1278', 'C1279', 'C1280', 'C1281', 'C1282', 'C1283', 'C1284', 'C1285', 'C1286', 'C1287', 'C1288', 'C1289', 'C1290', 'C1301', 'C1302', 'C1303', 'C1304', 'C1305', 'C1306', 'C1307', 'C1308', 'C1309', 'C1310', 'C1311', 'C1312', 'C1313', 'C1314', 'C1315', 'C1316', 'C1317', 'C1318', 'C1319', 'C1320', 'C1321', 'C1322', 'C1323', 'C1324', 'C1325', 'C1326', 'C1327', 'C1328', 'C1329', 'C1330', 'C1331', 'C1332', 'C1333', 'C1334', 'C1335', 'C1336', 'C1337', 'C1338', 'C1339', 'C1340', 'C1341', 'C1342', 'C1343', 'C1344', 'C1345', 'C1346', 'C1347', 'C1348', 'C1349', 'C1350', 'C1356', 'C1357', 'C1358', 'C1359', 'C1360', 'C1361', 'C1362', 'C1363', 'C1364', 'C1365', 'C1366', 'C1367', 'C1368', 'C1369', 'C1370', 'C1371', 'C1372', 'C1373', 'C1374', 'C1375', 'C1376', 'C1377', 'C1378', 'C1379', 'C1380', 'C1381', 'C1382', 'C1383', 'C1384', 'C1385', 'C1386', 'C1387', 'C1388', 'C1389', 'C1390', 'C1391', 'C1392', 'C1393', 'C1394', 'C1395', 'C1396', 'C1397', 'C1398', 'C1399', 'C1400', 'C1401', 'C1402', 'C1403', 'C1404', 'C1405', 'C1406', 'C1407', 'C1408', 'C1409', 'C1410', 'C1411', 'C1412', 'C1413', 'C1414', 'C1415', 'C1416', 'C1417', 'C1418', 'C1419', 'C1420', 'C1421', 'C1422', 'C1423', 'C1424', 'C1425', 'C1426', 'C1427', 'C1428', 'C1429', 'C1430', 'C1431', 'C1432', 'C1433', 'C1434', 'C1435', 'C1436', 'C1437', 'C1438', 'C1439', 'C1440', 'C1441', 'C1442', 'C1443', 'C1444', 'C1445', 'C1446', 'C1447', 'C1448', 'C1449', 'C1450', 'C1451', 'C1452', 'C1453', 'C1454', 'C1455', 'C1456', 'C1457', 'C1458', 'C1459', 'C1460', 'C1466', 'C1467', 'C1468', 'C1469', 'C1470', 'C1471', 'C1472', 'C1473', 'C1474', 'C1475', 'C1476', 'C1477', 'C1478', 'C1479', 'C1480', 'C1481', 'C1482', 'C1483', 'C1484', 'C1485', 'C1486', 'C1487', 'C1488', 'C1489', 'C1490', 'C1491', 'C1492', 'C1493', 'C1494', 'C1495', 'C1501', 'C1502', 'C1503', 'C1504', 'C1505', 'C1506', 'C1507', 'C1508', 'C1509', 'C1510', 'C1511', 'C1512', 'C1513', 'C1514', 'C1515', 'C1516', 'C1517', 'C1518', 'C1519', 'C1520', 'C1521', 'C1522', 'C1523', 'C1524', 'C1525', 'C1526', 'C1527', 'C1528', 'C1529', 'C1530', 'C1531', 'C1532', 'C1533', 'C1534', 'C1535', 'C1536', 'C1537', 'C1538', 'C1539', 'C1540', 'C1541', 'C1542', 'C1543', 'C1544', 'C1545', 'C1546', 'C1547', 'C1548', 'C1549', 'C1550', 'C1551', 'C1552', 'C1553', 'C1554', 'C1555', 'C1556', 'C1557', 'C1558', 'C1559', 'C1560', 'C1561', 'C1562', 'C1563', 'C1564', 'C1565', 'C1566', 'C1567', 'C1568', 'C1569', 'C1570', 'C1571', 'C1572', 'C1573', 'C1574', 'C1575', 'C1576', 'C1577', 'C1578', 'C1579', 'C1580', 'C1581', 'C1582', 'C1583', 'C1584', 'C1585', 'C1586', 'C1587', 'C1588', 'C1589', 'C1590', 'C1591', 'C1592', 'C1593', 'C1594', 'C1595', 'C1597', 'C1598', 'C1599', 'C1600', 'C1601', 'C16010', 'C1602', 'C1603', 'C1604', 'C1605', 'C1606', 'C1607', 'C1608', 'C1609', 'C1610', 'C1611', 'C1612', 'C1613', 'C1614', 'C1615', 'C1616', 'C1617', 'C1618', 'C1619', 'C1620', 'C1621', 'C1622', 'C1623', 'C1624', 'C1625', 'C1626', 'C1627', 'C1628', 'C1629', 'C1630', 'C1631', 'C1632', 'C1633', 'C1635', 'C1636', 'C1637', 'C1638', 'C1639', 'C1640', 'C1641', 'C1642', 'C1643', 'C1644', 'C1645', 'C1646', 'C1647', 'C1651', 'C1652', 'C1653', 'C1654', 'C1655', 'C1656', 'C1657', 'C1658', 'C1659', 'C1660', 'C1666', 'C1667', 'C1668', 'C1669', 'C1670', 'C1671', 'C1672', 'C1673', 'C1674', 'C1675', 'C1678', 'C1679', 'C1680', 'C1681', 'C1682', 'C1683', 'C1684', 'C1685', 'C1686', 'C1687', 'C1688', 'C1689', 'C1690', 'C1691', 'C1692', 'C1693', 'C1694', 'C1695', 'C1696', 'C1697', 'C1699', 'C1700', 'C1701', 'C1702', 'C1703', 'C1704', 'C1705', 'C1706', 'C1707', 'C1708', 'C1709', 'C1710', 'C1711', 'C1713', 'C1714', 'C1715', 'C1716', 'C1717', 'C1718', 'C1719', 'C1720', 'C1721', 'C1722', 'C1723', 'C1724', 'C1725', 'C1726', 'C1727', 'C1728', 'C1729', 'C1730', 'C1731', 'C1732', 'C1733', 'C1734', 'C1735', 'C1737', 'C1738', 'C1739', 'C1740', 'C1741', 'C1742', 'C1746', 'C1748', 'C1749', 'C1750', 'C1751', 'C1752', 'C1754', 'C1755', 'C1756', 'C1757', 'C1758', 'C1759', 'C1760', 'C1761', 'C1762', 'C1763', 'C1769', 'C1770', 'C1771', 'C1773', 'C1774', 'C1776', 'C1779', 'C1780', 'C1781', 'C1782', 'C1784', 'C1785', 'C1786', 'C1788', 'C1789', 'C1790', 'C1791', 'C1792', 'C1793', 'C1794', 'C1795', 'C1796', 'C2001', 'C2002', 'C2003', 'C2004', 'C2005', 'C2006', 'C2007', 'C2008', 'C2009', 'C2010', 'C2011', 'C2012', 'C2013', 'C2014', 'C2015', 'C2016', 'C2017', 'C2018', 'C2019', 'C2020', 'C2021', 'C2022', 'C2023', 'C2024', 'C2025', 'C2027', 'C2028', 'C2029', 'C2030', 'C2031', 'C2032', 'C2033', 'C2034', 'C2035', 'C2036', 'C2037', 'C2038', 'C2039', 'C2040', 'C2041', 'C2042', 'C2043', 'C2044', 'C2045', 'C2046', 'C2047', 'C2048', 'C2049', 'C2050', 'C2051', 'C2052', 'C2053', 'C2054', 'C2055', 'C2056', 'C2057', 'C2058', 'C2059', 'C2060', 'C2061', 'C2062', 'C2063', 'C2064', 'C2065', 'C2071', 'C2072', 'C2073', 'C2074', 'C2075', 'C2076', 'C2077', 'C2078', 'C2079', 'C2080', 'C2081', 'C2082', 'C2083', 'C2084', 'C2085', 'C2086', 'C2087', 'C2088', 'C2089', 'C2090', 'C2101', 'C2102', 'C2103', 'C2104', 'C2105', 'C2106', 'C2107', 'C2108', 'C2109', 'C2110', 'C2111', 'C2112', 'C2113', 'C2114', 'C2115', 'C2116', 'C2117', 'C2118', 'C2119', 'C2120', 'C2121', 'C2122', 'C2123', 'C2124', 'C2125', 'C2126', 'C2127', 'C2128', 'C2129', 'C2130', 'C2136', 'C2137', 'C2138', 'C2139', 'C2140', 'C2141', 'C2142', 'C2143', 'C2144', 'C2145', 'C2146', 'C2147', 'C2148', 'C2149', 'C2150', 'C2151', 'C2152', 'C2153', 'C2154', 'C2155', 'C2156', 'C2157', 'C2158', 'C2159', 'C2160', 'C2161', 'C2162', 'C2163', 'C2164', 'C2165', 'C2166', 'C2167', 'C2168', 'C2169', 'C2170', 'C2171', 'C2172', 'C2174', 'C2175', 'C2176', 'C2177', 'C2178', 'C2179', 'C2180', 'C2181', 'C2182', 'C2183', 'C2201', 'C2202', 'C2203', 'C2204', 'C2205', 'C2206', 'C2207', 'C2208', 'C2209', 'C2210', 'C2211', 'C2212', 'C2213', 'C2214', 'C2215', 'C2216', 'C2217', 'C2218', 'C2219', 'C2220', 'C2222', 'C2224', 'C2225', 'C2226', 'C2227', 'C2228', 'C2230', 'C2231', 'C2232', 'C2233', 'C2235', 'C2236', 'C2237', 'C2238', 'C2239', 'C2240', 'C2241', 'C2242', 'C2243', 'C2249', 'C2250', 'C2251', 'C2253', 'C2254', 'C2255', 'C2256', 'C2257', 'C2258', 'C2259', 'C2260', 'C2261', 'C2262', 'C2264', 'C2265', 'C2267', 'C2268', 'C2270', 'C2271', 'C2272', 'C2273', 'C2274', 'C2276', 'C2277', 'C2279', 'C2280', 'C2281', 'C2282', 'C2283', 'C2285', 'C2286', 'C2287', 'C2288', 'C2289', 'C2290', 'C2292', 'C2293', 'C2294', 'C2295', 'C2296', 'C2297', 'C2298', 'C2299', 'C2300', 'C2301', 'C2302', 'C2303', 'C2304', 'C2305', 'C2306', 'C2307', 'C2308', 'C2309', 'C2310', 'C2311', 'C2312', 'C2313', 'C2319', 'C2320', 'C2321', 'C2322', 'C2323', 'C2324', 'C2325', 'C2326', 'C2327', 'C2328', 'C2329', 'C2330', 'C2331', 'C2332', 'C2333', 'C2334', 'C2335', 'C2336', 'C2337', 'C2338', 'C2339', 'C2340', 'C2341', 'C2342', 'C2343', 'C2344', 'C2345', 'C2346', 'C2347', 'C2348', 'C2349', 'C2350', 'C2351', 'C2352', 'C2353', 'C2354', 'C2355', 'C2356', 'C2357', 'C2358', 'C2360', 'C2363', 'C2364', 'C2365', 'C2366', 'C2367', 'C2368', 'C2369', 'C2370', 'C2371', 'C2372', 'C2373', 'C2374', 'C2375', 'C2376', 'C2377', 'C2378', 'C2379', 'C2380', 'C2381', 'C2382', 'C2383', 'C2384', 'C2385', 'C2386', 'C2387', 'C2388', 'C2389', 'C2390', 'C2392', 'C2393', 'C2394', 'C2395', 'C2396', 'C2397', 'C2398', 'C2399', 'C2403', 'C2404', 'C2406', 'C2407', 'C2408', 'C2409', 'C2410', 'C2413', 'C2415', 'C2416', 'C2417', 'C2418', 'C2419', 'C2420', 'C2421', 'C2422', 'C2423', 'C2424', 'C2425', 'C2426', 'C2427', 'C2428', 'C2429', 'C2430', 'C2431', 'C2432', 'C2433', 'C2434', 'C2435', 'C2436', 'C2437', 'C2438', 'C2439', 'C2440', 'C2441', 'C2442', 'C2443', 'C2444', 'C2445', 'C2446', 'C2447', 'C2448', 'C2449', 'C2450', 'C2451', 'C2452', 'C2453', 'C2454', 'C2455', 'C2456', 'C2457', 'C2458', 'C2459', 'C2460', 'C2461', 'C2462', 'C2463', 'C2464', 'C2465', 'C2466', 'C2467', 'C2468', 'C2469', 'C2470', 'C2471', 'C2472', 'C2473', 'C2474', 'C2475', 'C2476', 'C2477', 'C2478', 'C2479', 'C2480', 'C2481', 'C2482', 'C2483', 'C2484', 'C2485', 'C2486', 'C2487', 'C2488', 'C2489', 'C2490', 'C2491', 'C2492', 'C2493', 'C2494', 'C2495', 'C2496', 'C2497', 'C2498', 'C2499', 'C2500', 'C2501', 'C2502', 'C2503', 'C2504', 'C2701', 'C2702', 'C2703', 'C2704', 'C2705', 'C2706', 'C2707', 'C2708', 'C2709', 'C2710', 'C2711', 'C2712', 'C2713', 'C2714', 'C2715', 'C2716', 'C2717', 'C2718', 'C2719', 'C2720', 'C2721', 'C2722', 'C2723', 'C2724', 'C2725', 'C2726', 'C2727', 'C2728', 'C2729', 'C2730', 'C2731', 'C2732', 'C2733', 'C2734', 'C2735', 'C2736', 'C2738', 'C2739', 'C2740', 'C2741', 'C2742', 'C2743', 'C2744', 'C2745', 'C2746', 'C2747', 'C2748', 'C2749', 'C2751', 'C2753', 'C2754', 'C2755', 'C2756', 'C2757', 'C2758', 'C2759', 'C2760', 'C2761', 'C2762', 'C2763', 'C2764', 'C2765', 'C2766', 'C2767', 'C2768', 'C2769', 'C2770', 'C2772', 'C2773', 'C2774', 'C2775', 'C2776', 'C2780', 'C2782', 'C2783', 'C2785', 'C2786', 'C2787', 'C2788', 'C2789', 'C2790', 'C2791', 'C2792', 'C2793', 'C2794', 'C2795', 'C2796', 'C2797', 'C2798', 'C2799', 'C2800', 'C3001', 'C3002', 'C3003', 'C3004', 'C3005', 'C3006', 'C3008', 'C3009', 'C3010', 'C3011', 'C3014', 'C3015', 'C3016', 'C3018', 'C3020', 'C3021', 'C3022', 'C3023', 'C3024', 'C3025', 'C3026', 'C3027', 'C3028', 'C3029', 'C3030', 'C3031', 'C3032', 'C3033', 'C3034', 'C3035', 'C3036', 'C3037', 'C3038', 'C3039', 'C3040', 'C3041', 'C3042', 'C3043', 'C3044', 'C3046', 'C3047', 'C3049', 'C3050', 'C3051', 'C3052', 'C3053', 'C3054', 'C3055', 'C3056', 'C3057', 'C3059', 'C3060', 'C3061', 'C3062', 'C3063', 'C3064', 'C3065', 'C3066', 'C3067', 'C3068', 'C3069', 'C3070', 'C3071', 'C3072', 'C3073', 'C3074', 'C3075', 'C3076', 'C3077', 'C3078', 'C3079', 'C3080', 'C3081', 'C3082', 'C3083', 'C3084', 'C3085', 'C3086', 'C3089', 'C4001', 'C4002', 'C4003', 'C4004', 'C4005', 'C4006', 'C4007', 'C4008', 'C4009', 'F0002', 'F0003', 'F0312', 'F1223', 'F1224', 'F1225', 'F1226', 'F1227', 'F1228', 'F1232', 'F1234', 'H1702', 'H1703', 'H1704', 'H1705', 'H1706', 'H1707', 'H1708', 'H1709', 'H1710', 'H1711', 'H1712', 'H1713', 'H1714', 'H1715', 'H1716', 'H1717', 'H1718', 'H1719', 'H1720', 'H1721', 'H1722', 'H1723', 'H1724', 'H1725', 'H1726', 'H1727', 'H1728', 'H1729', 'H1730', 'H1734', 'H1735', 'H1736', 'H1737', 'H1738', 'H1739', 'H1740', 'H1741', 'H1742', 'H1743', 'H1744', 'H1745', 'H1746', 'H1747', 'H1748', 'H1749', 'H1750', 'H1751', 'H1752', 'H1753', 'H1754', 'H1755', 'H1756', 'H1757', 'H1758', 'H1759', 'H1760', 'H1761', 'H1762', 'H1763', 'H1767', 'H1768', 'H1769', 'H1770', 'H1771', 'H1772', 'H1773', 'H1774', 'H1775', 'H1776', 'H1777', 'H1778', 'H1779', 'H1780', 'H1781', 'H1782', 'H1783', 'H1784', 'H1785', 'H1786', 'H1787', 'H1788', 'H1789', 'H1790', 'H1791', 'H1792', 'H1793', 'H1794', 'H1795', 'H1796', 'H1801', 'H1802', 'H1803', 'H1804', 'H1805', 'H1806', 'H1807', 'H1808', 'H1809', 'H1810', 'H1811', 'H1812', 'H1813', 'H1814', 'H1815', 'H1816', 'H1817', 'H1818', 'H1819', 'H1820', 'H1821', 'H1822', 'H1823', 'H1824', 'H1825', 'H1826', 'H1827', 'H1828', 'H1829', 'H1830', 'H1831', 'H1832', 'H1833', 'H1834', 'H1835', 'H1836', 'H1837', 'H1838', 'H1839', 'H1841', 'H1842', 'H1843', 'H1844', 'H1845', 'H1846', 'H1847', 'H1848', 'H1849', 'H1850', 'H1851', 'H1852', 'H1853', 'H1854', 'H1855', 'H1856', 'H1857', 'H1858', 'H1859', 'H1860', 'H1861', 'H1862', 'H1863', 'H1867', 'H1868', 'H1869', 'H1870', 'H1871', 'H1872', 'H1873', 'H1874', 'H1875', 'H1876', 'H1877', 'H1878', 'H1879', 'H1880', 'H1881', 'H1882', 'H1883', 'H1884', 'H1885', 'H1886', 'H1887', 'H1888', 'H1889', 'H1890', 'H1891', 'H1892', 'H1893', 'H1894', 'H1895', 'H1896', 'H1897', 'H1898', 'H1899', 'H1901', 'H1902', 'H1903', 'H1904', 'H1905', 'H1906', 'H1907', 'H1908', 'H1909', 'H1910', 'H1911', 'H1912', 'H1913', 'H1914', 'H1915', 'H1916', 'H1917', 'H1918', 'H1919', 'H1920', 'H1921', 'H1922', 'H1923', 'H1924', 'H1925', 'H1926', 'H1927', 'H1928', 'H1929', 'H1930', 'H1931', 'H1932', 'H1933', 'H1934', 'H1935', 'H1936', 'H1937', 'H1938', 'H1939', 'H1940', 'H1986', 'H2102', 'H2103', 'H2104', 'H2105', 'H2106', 'I3101', 'I3102', 'I3103', 'I3104', 'I3105', 'I3106', 'L0001', 'L0002', 'L0003', 'L0004', 'L0005', 'L0006', 'L0007', 'L0008', 'L0009', 'L0010', 'L0011', 'L0012', 'L0013', 'L0014', 'L0015', 'L0016', 'L0017', 'L0018', 'L0019', 'L0020', 'L0021', 'L0022', 'L0023', 'L0024', 'L0025', 'L0026', 'L0027', 'L0028', 'L0029', 'L0030', 'L0031', 'L0101', 'L0102', 'L0103', 'L0104', 'L0105', 'L0106', 'L0107', 'L0108', 'L0109', 'L0110', 'M0021', 'M0071', 'M0261', 'M0263', 'M0264', 'M0265', 'M0266', 'M0268', 'M0269', 'M0281', 'M0282', 'M0283', 'M0284', 'M0285', 'M0286', 'M0287', 'M0288', 'M0289', 'M0290', 'M0300', 'M0361', 'M0362', 'M0364', 'M0366', 'M0367', 'M0386', 'M0421', 'M0423', 'M0424', 'M0425', 'M0426', 'M0427', 'M0428', 'M0429', 'M0431', 'M0461', 'M0462', 'M0464', 'M0465', 'M0467', 'M0488', 'M0543', 'M0571', 'M0646', 'M0656', 'M0716', 'M0717', 'M0718', 'M0719', 'M0727', 'M0728', 'M0729', 'M0741', 'M0752', 'M0753', 'M0754', 'M0761', 'M0762', 'M0765', 'M0776', 'M0780', 'M0786', 'M0787', 'M0788', 'M0790', 'M0796', 'M0797', 'M0798', 'M0800', 'M0851', 'M0852', 'M0853', 'M0916', 'M0917', 'M0918', 'M0919', 'M0927', 'M0952', 'M0954', 'M1066', 'M2026', 'M2391', 'M2400', 'N0101', 'N0102', 'N0103', 'N0104', 'N0105', 'N0106', 'N0107', 'N0108', 'N0109', 'N0110', 'N6001', 'N6002', 'N6003', 'N6004', 'N6005', 'N6006', 'N6007', 'N6008', 'N6009', 'N6010', 'N6011', 'N6012', 'N6013', 'N6014', 'N6015', 'N6016', 'N6017', 'N6018', 'N6019', 'N6020', 'N6021', 'N6022', 'N6023', 'N6024', 'N6025', 'N6026', 'N6027', 'N6028', 'N6029', 'N6030', 'N6031', 'N6032', 'N6033', 'N6034', 'N6035', 'N6036', 'N6038', 'N6039', 'N6040', 'P111', 'P112', 'P113', 'P114', 'P115', 'P116', 'P117', 'P118', 'P119', 'P120', 'P121', 'P122', 'P123', 'P124', 'P125', 'S0088', 'S8001', 'S8002', 'S8003', 'S8004', 'S8005', 'S8007', 'S8009', 'S8010', 'S8011', 'S8012', 'S8013', 'S8014', 'S8015', 'S8016', 'S8017', 'S8018', 'S8019', 'S8020', 'S8021', 'S8022', 'S8023', 'S8024', 'S8025', 'S8026', 'S8027', 'S8029', 'S8031', 'S8032', 'S8034', 'S8035', 'T3101', 'T3102', 'T3103', 'T3104', 'T3105', 'T3106', 'T3107', 'T3108', 'T3109', 'T3110', 'T3111', 'T3112', 'T3113', 'T3114', 'T3115', 'T3116', 'T3117', 'T3118', 'T3119', 'T3120', 'T3121', 'T3122', 'T3123', 'T3124', 'T3125', 'T3126', 'T3129', 'T3130', 'T3131', 'T3132', 'T3133', 'T3134', 'T3135', 'T3136', 'T3137', 'T3138', 'T3139', 'T3140', 'T3141', 'T3142', 'T3143', 'T3144', 'T4901', 'T4902', 'T4903', 'T4904', 'T4905', 'T4906', 'T4907', 'T4908', 'T4909', 'T4910', 'T4911', 'T4912', 'T4913', 'T4914', 'T4915', 'T4916', 'T4917', 'T4918', 'T4919', 'T4920', 'T4921', 'T4922', 'T4923', 'T4924', 'T4925', 'T4926', 'T4927', 'T4929', 'T4930', 'T4931', 'T4932', 'T4933', 'T4934', 'T4935', 'T4936', 'T4937', 'T4938', 'T4939', 'T4940', 'T4941', 'T4942', 'T4943', 'T4944', 'T4945', 'T4946', 'T4947', 'T4948', 'T4949', 'T4951', 'T4952', 'T4953', 'T4954', 'T4956', 'T4957', 'T4958', 'T4959', 'T4960', 'T4961', 'T4962', 'T4963', 'T4964', 'T4965', 'T4966', 'T4967', 'T4968', 'T4971', 'T4972', 'T4973', 'T4974', 'T4975', 'T4976', 'T4977', 'T4978', 'T4979', 'T4980', 'T4981', 'T4982', 'T4983', 'T4984', 'T4985', 'T4987', 'T4990', 'T4992', 'T4993', 'T4994', 'T4995', 'T4996', 'T4997', 'X0001', 'X0002', 'X0003', 'X0004', 'X0005', 'X0006', 'X0007', 'X0008', 'X0009', 'X0010', 'X0011', 'X0012', 'X0013', 'X0014', 'X0015', 'X0016', 'X0017', 'X0018', 'X0019', 'X0020', 'X0021', 'X0022', 'X0023', 'X0024', 'X0025', 'X0026', 'X0027', 'X0028', 'X0029', 'X0030', 'X0031', 'X0032', 'X0033', 'X0034', 'X0035', 'X0036', 'X0037', 'X0038', 'X0039', 'X0040', 'X0041', 'X0050', 'X0051', 'X0052', 'X0053', 'X0054', 'X0055', 'X0056', 'X0057', 'X0070', 'X0088', 'X0097', 'X0100', 'X0112', 'X0170', 'X0196', 'X0219', 'X0242', 'X0248', 'X0257', 'X0271', 'X0278', 'X0282', 'X0287', 'X0293', 'X0299', 'X0324', 'X0336', 'X0338', 'X0339', 'X0346', 'X0378', 'X0436', 'X0712', 'X0725', 'X0747', 'X0774', 'X0861', 'X0868', 'X1000', 'X1116', 'X1421', 'X1427', 'X1430', 'X1500', 'X1502', 'X1504', 'X1514', 'X1516', 'X1532', 'X1549', 'X1564', 'X1566', 'X1567', 'X1591', 'X1592', 'X1593', 'X1599', 'X1679', 'X1699', 'X1701', 'X1735', 'X1752', 'X1788', 'X2254', 'X2260', 'X2279', 'X2313', 'X2342', 'X2350', 'X2356', 'X2364', 'X2375', 'X2429', 'X2487', 'X3026', 'X3053', 'X3082', 'X3084', 'X3103', 'X3104', 'X3111', 'X3113', 'X3115', 'X4000', 'X4001', 'X4003', 'X4006', 'X4913', 'X4938', 'X4947', 'X4965', 'X4987', 'X7021'];
  modelNumberFilteredOptions: Observable<string[]>;

  // date = new FormControl(new Date());
  // serializedDate = new FormControl((new Date()).toISOString());
  customerList: Customer[];
  agentList: Agent[];
  materialList: Material[];
  products: Product[];

  productData : Product[] ;
  orderDetails: OrderDetail[] = [];
  orderMasterForm: FormGroup;
  orderDetailsForm: FormGroup;
  // orderData: object;
  isSaveEnabled = true;
  orderData: OrderMaster[] = [];
  product_id: number;
  showProduct = true;
  showUpdate = false;
  yourModelDate: string;
  minDate = new Date(2010, 11, 2);
  maxDate = new Date(2021, 3, 2);
  startDate = new Date(2020, 0, 2);
  public currentError: any;

  pipe = new DatePipe('en-US');

  now = Date.now();


  // tslint:disable-next-line:max-line-length
  constructor(private confirmationDialogService: ConfirmationDialogService, private customerService: CustomerService, private orderService: OrderService, private storage: StorageMap, private productService: ProductService, private _snackBar: MatSnackBar) {
    this.orderService.getOrderMaster();
  }
  onlyOdds = (d: Date): boolean => {
    const date = d.getDate();
    // Even dates are disabled.
    return true;
    return date % 2 === 0;
  }

  ngOnInit(): void {
    this.isSaveEnabled = true;
    this.orderMasterForm = this.orderService.orderMasterForm;
    this.orderDetailsForm = this.orderService.orderDetailsForm;
    // this.orderDetailsForm.controls['amount'].disable();
    this.showUpdate = false;
    this.orderData = this.orderService.getOrderMaster();
    this.customerService.getCustomerUpdateListener()
      .subscribe((customers: Customer[]) => {
        this.customerList = customers;
      });

    this.orderService.getAgentUpdateListener()
      .subscribe((agent: Agent[]) => {
        this.agentList = agent;
      });

    this.orderService.getMaterialUpdateListener()
      .subscribe((material: Material[]) => {
        this.materialList = material;
      });

    this.productService.getProductUpdateListener()
      .subscribe((responseProducts: Product[]) => {
      this.products = responseProducts;

      // console.log('from order');
      // console.log(this.products);
    });

    this.orderService.getOrderUpdateListener()
      .subscribe((responseOrders: OrderMaster[]) => {
        this.orderData = responseOrders;

      });

    this.modelNumberFilteredOptions = this.modelNumberControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  updateMaster(){
    const user = JSON.parse(localStorage.getItem('user'));
    this.orderMasterForm.value.employee_id = user.id;
    this.orderMasterForm.value.order_date = this.pipe.transform(this.orderMasterForm.value.order_date, 'yyyy-MM-dd');
    this.orderMasterForm.value.delivery_date = this.pipe.transform(this.orderMasterForm.value.delivery_date, 'yyyy-MM-dd');
    this.orderService.masterUpdate().subscribe((response) =>{

      if (response.success === 1){
        this._snackBar.openFromComponent(SncakBarComponent, {
          duration: 4000, data: {message: 'Order Master Updated'}
        });
      }
      this.currentError = null;

    },(error) => {
      console.log('error occured ');
      console.log(error);
      this.currentError = error;
      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: error.message}
      });
    });


}


  addOrder(){
    this.isSaveEnabled = false;
    const index = this.products.findIndex(x => x.model_number === this.orderDetailsForm.value.model_number);
    this.orderDetailsForm.value.product_id = this.products[index].id;
    this.orderService.setOrderDetails();
    this.orderDetailsForm.reset();
    this.orderDetailsForm.value.amount = null;
    this.orderDetails = this.orderService.orderDetails;
  }

  productShow(){
    this.showProduct = !this.showProduct;
  }

  fetchDetails(data){
    console.log(data);
    this.isSaveEnabled=false;
    this.showProduct = true;
    this.showUpdate = true;
    this.orderService.fetchOrderDetails(data.id);
    this.orderService.getOrderDetailsListener()
      .subscribe((orderDetails: []) => {
        this.orderDetails = orderDetails;

      });
    this.orderMasterForm.patchValue({id: data.id, customer_id : data.person_id, agent_id: data.agent_id, order_date: data.date_of_order, delivery_date: data.date_of_delivery});
  }
  fillOrderDetailsForm(details){
    // this.orderDetailsForm.setValue(details);
    this.isSaveEnabled=false;
    this.orderDetailsForm.patchValue({id: details.id, model_number : details.model_number, p_loss: details.p_loss, price: details.price, price_code: details.price_code, quantity: details.quantity, amount: details.amount, approx_gold: details.approx_gold, size: details.size });
    this.product_id = details.product_id;

  }
  updateOrder(){
    // this.orderDetailsForm.value.product_id = this.product_id;
    if (this.orderDetailsForm.value.product_id === undefined){
      const index = this.products.findIndex(x => x.model_number === this.orderDetailsForm.value.model_number);
      this.orderDetailsForm.value.product_id = this.products[index].id;
    }
    this.orderService.setOrderDetailsForUpdate();
    const user = JSON.parse(localStorage.getItem('user'));
    this.orderMasterForm.value.employee_id = user.id;
    this.orderMasterForm.value.order_date = this.pipe.transform(this.orderMasterForm.value.order_date, 'yyyy-MM-dd');
    this.orderMasterForm.value.delivery_date = this.pipe.transform(this.orderMasterForm.value.delivery_date, 'yyyy-MM-dd');
    this.orderService.setOrderMasterData();
    this.orderService.updateOrder().subscribe((response) => {

      if(response.success===1){
        this.orderDetailsForm.reset();
        this._snackBar.openFromComponent(SncakBarComponent, {
          duration: 4000, data: {message: 'Details Updated'}
        });
      }
      this.currentError=null;

    },(error) => {
      console.log('error occured');
      console.log(error);
      this.currentError=error;

      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: error.message}
      });

    });
    // this.orderService.getOrderDetailsUpdateListener()
    //   .subscribe((data: object) => {
    //     console.log(data);
    //   });
  }

  deleteOrderMaster(masterData){

    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete order master ?')
      .then((confirmed) => {
        // deleting record if confirmed
        if (confirmed){


          this.orderService.deleteOrderMaster(masterData.id).subscribe((response) => {
            if (response.success === 1){
              this._snackBar.openFromComponent(SncakBarComponent, {
                duration: 4000, data: {message: 'Order Deleted'}
              });
            }
            this.currentError = null;
          }, (error) => {
            console.log('error occured ');
            console.log(error);
            this.currentError = error;
            this._snackBar.openFromComponent(SncakBarComponent, {
              duration: 4000, data: {message: error.message}
            });
          });
        }
      })


      .catch(() => {
        console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)');
      });
    console.log(masterData);
  }


  deleteDetails(details){
    // console.log(details);
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete order detail ?')
      .then((confirmed) => {
        // deleting record if confirmed
        if (confirmed){
          this.orderService.deleteOrderDetails(details.id).subscribe((response) => {
            if (response.success === 1){
              this._snackBar.openFromComponent(SncakBarComponent, {
                duration: 4000, data: {message: 'Order Deleted'}
              });
            }
            this.currentError = null;
          }, (error) => {
            console.log('error occured ');
            console.log(error);
            this.currentError = error;
            this._snackBar.openFromComponent(SncakBarComponent, {
              duration: 4000, data: {message: error.message}
            });
          });
        }

      })
      .catch(() => {
        console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)');
      });
  }
  findModel(event){


    // const index = this.products.findIndex(k => k.model_number === this.orderDetailsForm.value.model_number.toString().toUpperCase() );

    const index = this.customerList.findIndex(k => k.id === this.orderMasterForm.value.customer_id );
    this.orderService.getProductData(this.orderDetailsForm.value.model_number,this.customerList[index].customer_category_id);

    //    if (index === -1){
    //       this._snackBar.openFromComponent(SncakBarComponent, {
    //         duration: 4000, data: {message: 'No Model Number Found'}
    //       });
    //     }
    // if (index !== -1){
    //   const x = this.products[index];
    //   this.orderDetailsForm.patchValue({p_loss : x.p_loss, price_code : x.price_code_name, price : x.price});
    // }
    this.orderService.getProductDataUpdateListener()
      .subscribe((responseProducts : Product[]) => {
      this.productData = responseProducts;

      this.orderDetailsForm.patchValue({ p_loss: this.productData[0].p_loss, price: this.productData[0].price,price_code : this.productData[0].price_code_name});

    });
  }




  clearForm(){
    this.orderMasterForm.reset();
    this.orderDetailsForm.reset();
  }

  onSubmit(){
    const user = JSON.parse(localStorage.getItem('user'));
    this.orderMasterForm.value.employee_id = user.id;
    this.orderMasterForm.value.order_date = this.pipe.transform(this.orderMasterForm.value.order_date, 'yyyy-MM-dd');
    this.orderMasterForm.value.delivery_date = this.pipe.transform(this.orderMasterForm.value.delivery_date, 'yyyy-MM-dd');
    this.orderService.setOrderMasterData();
    let saveObserable = new Observable<any>();
    saveObserable = this.orderService.saveOrder();
    saveObserable.subscribe((response) => {
      if (response.success === 1){
        this.orderMasterForm.reset();
        this.orderDetailsForm.reset();
        this.orderDetails = [];
        this._snackBar.openFromComponent(SncakBarComponent, {
          duration: 4000, data: {message: 'Order Saved'}
        });
        this.orderDetailsForm.value.amount=0;
      }
    }, (error) => {
      console.log('error occured ');
      console.log(error);
      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: error.message}
      });
    });
  }

  // selectCustomerForOrder() {
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   this.orderMasterForm.value.employee_id = user.id;
  //   this.orderMasterForm.value.order_date = this.pipe.transform(this.orderMasterForm.value.order_date, 'yyyy-MM-dd');
  //   this.orderMasterForm.value.delivery_date = this.pipe.transform(this.orderMasterForm.value.delivery_date, 'yyyy-MM-dd');
  //   this.orderService.setOrderMasterData();
  // }
}
