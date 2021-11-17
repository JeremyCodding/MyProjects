import 'package:flutter/material.dart';

class TelaEmpresa extends StatefulWidget {
  @override
  _TelaEmpresaState createState() => _TelaEmpresaState();
}

class _TelaEmpresaState extends State<TelaEmpresa> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text("Empresa"),
        backgroundColor: Colors.green,
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: EdgeInsets.all(16),
          child: Column(
            children: <Widget>[
              Row(
                children: <Widget>[
                  Image.asset("images/detalhe_empresa.png"),
                  Padding(
                    padding: EdgeInsets.only(left:10),
                    child: Text(
                      "Sobre a empresa",
                      style: TextStyle(
                        fontSize: 20,
                        color: Colors.deepOrange,
                      ),
                    ),
                  )
                ],
              ),
              Padding(
                padding: EdgeInsets.only(top: 16),
                child: Text(
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lobortis justo at velit interdum, eu aliquam ante sagittis. Donec euismod metus sit amet sem dignissim, vitae mattis dui semper. Morbi libero dolor, tincidunt non rutrum sed, sagittis id metus. Mauris in auctor eros. Ut non aliquet nibh. Vestibulum pulvinar eros vitae sapien congue, id facilisis velit dignissim. Curabitur ac faucibus eros, sed sagittis leo."
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lobortis justo at velit interdum, eu aliquam ante sagittis. Donec euismod metus sit amet sem dignissim, vitae mattis dui semper. Morbi libero dolor, tincidunt non rutrum sed, sagittis id metus. Mauris in auctor eros. Ut non aliquet nibh. Vestibulum pulvinar eros vitae sapien congue, id facilisis velit dignissim. Curabitur ac faucibus eros, sed sagittis leo."
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lobortis justo at velit interdum, eu aliquam ante sagittis. Donec euismod metus sit amet sem dignissim, vitae mattis dui semper. Morbi libero dolor, tincidunt non rutrum sed, sagittis id metus. Mauris in auctor eros. Ut non aliquet nibh. Vestibulum pulvinar eros vitae sapien congue, id facilisis velit dignissim. Curabitur ac faucibus eros, sed sagittis leo."
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lobortis justo at velit interdum, eu aliquam ante sagittis. Donec euismod metus sit amet sem dignissim, vitae mattis dui semper. Morbi libero dolor, tincidunt non rutrum sed, sagittis id metus. Mauris in auctor eros. Ut non aliquet nibh. Vestibulum pulvinar eros vitae sapien congue, id facilisis velit dignissim. Curabitur ac faucibus eros, sed sagittis leo."
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
